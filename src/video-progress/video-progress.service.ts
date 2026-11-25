import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { isForeignKeyViolation } from '../database/pg-errors.js';
import type { SaveVideoProgressDto } from './dto/save-video-progress.dto.js';
import type {
  VideoProgress,
  VideoProgressSummary,
} from './entities/video-progress.entity.js';

const PROGRESS_COLUMNS = `id, user_id AS "userId", video_id AS "videoId",
  is_watched AS "isWatched", watched_at AS "watchedAt",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export interface VideoProgressFilters {
  userId?: number;
  videoId?: number;
}

@Injectable()
export class VideoProgressService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: VideoProgressFilters = {}): Promise<VideoProgress[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<VideoProgress>(
      `SELECT ${PROGRESS_COLUMNS} FROM video_progress
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR video_id = $2)
       ORDER BY id`,
      [filters.userId ?? null, filters.videoId ?? null],
    );

    return result.rows;
  }

  async save(dto: SaveVideoProgressDto): Promise<VideoProgress> {
    try {
      // Creates the row the first time and updates it afterwards (upsert).
      // watched_at keeps the first time the video was marked as watched.
      const result = await this.db.query<VideoProgress>(
        `INSERT INTO video_progress AS vp (user_id, video_id, is_watched, watched_at)
         VALUES (
           $1, $2, COALESCE($3::boolean, TRUE),
           CASE WHEN COALESCE($3::boolean, TRUE) THEN NOW() END)
         ON CONFLICT (user_id, video_id) DO UPDATE SET
           is_watched = COALESCE($3::boolean, TRUE),
           watched_at = CASE
             WHEN COALESCE($3::boolean, TRUE) THEN COALESCE(vp.watched_at, NOW())
             ELSE NULL
           END,
           updated_at = NOW()
         RETURNING ${PROGRESS_COLUMNS}`,
        [dto.userId, dto.videoId, dto.isWatched],
      );

      return result.rows[0];
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException('userId or videoId does not exist');
      }

      throw error;
    }
  }

  async summary(
    userId: number,
    genreId?: number,
  ): Promise<VideoProgressSummary> {
    const user = await this.db.query('SELECT 1 FROM users WHERE id = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const result = await this.db.query<{ total: number; watched: number }>(
      `SELECT COUNT(v.id)::int AS total,
              COUNT(vp.id) FILTER (WHERE vp.is_watched)::int AS watched
       FROM videos v
       LEFT JOIN video_progress vp
         ON vp.video_id = v.id AND vp.user_id = $1
       WHERE ($2::int IS NULL OR v.genre_id = $2)`,
      [userId, genreId ?? null],
    );

    const { total, watched } = result.rows[0];

    return {
      userId,
      totalVideos: total,
      watchedVideos: watched,
      percentage: total === 0 ? 0 : Math.round((watched / total) * 1000) / 10,
    };
  }
}
