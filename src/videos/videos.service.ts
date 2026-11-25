import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isCheckViolation,
  isForeignKeyViolation,
} from '../database/pg-errors.js';
import type { CreateVideoDto } from './dto/create-video.dto.js';
import type { UpdateVideoDto } from './dto/update-video.dto.js';
import type { Video } from './entities/video.entity.js';

const VIDEO_COLUMNS = `id, title, description, video_url AS "videoUrl",
  thumbnail_url AS "thumbnailUrl", duration_minutes AS "durationMinutes",
  difficulty_level AS "difficultyLevel", genre_id AS "genreId", instrument,
  sort_order AS "sortOrder", attachments_count AS "attachmentsCount",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export interface VideoFilters {
  genreId?: number;
  instrument?: string;
  difficultyLevel?: string;
}

@Injectable()
export class VideosService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: VideoFilters = {}): Promise<Video[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<Video>(
      `SELECT ${VIDEO_COLUMNS} FROM videos
       WHERE ($1::int IS NULL OR genre_id = $1)
         AND ($2::text IS NULL OR instrument = $2)
         AND ($3::text IS NULL OR difficulty_level = $3)
       ORDER BY sort_order, id`,
      [
        filters.genreId ?? null,
        filters.instrument ?? null,
        filters.difficultyLevel ?? null,
      ],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<Video> {
    const result = await this.db.query<Video>(
      `SELECT ${VIDEO_COLUMNS} FROM videos WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Video ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateVideoDto): Promise<Video> {
    try {
      const result = await this.db.query<Video>(
        `INSERT INTO videos (title, description, video_url, thumbnail_url,
           duration_minutes, difficulty_level, genre_id, instrument,
           sort_order, attachments_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, COALESCE($9, 0), COALESCE($10, 0))
         RETURNING ${VIDEO_COLUMNS}`,
        [
          dto.title,
          dto.description,
          dto.videoUrl,
          dto.thumbnailUrl,
          dto.durationMinutes,
          dto.difficultyLevel,
          dto.genreId,
          dto.instrument,
          dto.sortOrder,
          dto.attachmentsCount,
        ],
      );

      return result.rows[0];
    } catch (error) {
      this.rethrowKnownErrors(error, dto.genreId);
    }
  }

  async update(id: number, dto: UpdateVideoDto): Promise<Video> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<Video>(
        `UPDATE videos
         SET title = COALESCE($2, title),
             description = COALESCE($3, description),
             video_url = COALESCE($4, video_url),
             thumbnail_url = COALESCE($5, thumbnail_url),
             duration_minutes = COALESCE($6, duration_minutes),
             difficulty_level = COALESCE($7, difficulty_level),
             genre_id = COALESCE($8, genre_id),
             instrument = COALESCE($9, instrument),
             sort_order = COALESCE($10, sort_order),
             attachments_count = COALESCE($11, attachments_count),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${VIDEO_COLUMNS}`,
        [
          id,
          dto.title,
          dto.description,
          dto.videoUrl,
          dto.thumbnailUrl,
          dto.durationMinutes,
          dto.difficultyLevel,
          dto.genreId,
          dto.instrument,
          dto.sortOrder,
          dto.attachmentsCount,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Video ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      this.rethrowKnownErrors(error, dto.genreId);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM videos WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException(`Video ${id} not found`);
    }
  }

  private rethrowKnownErrors(error: unknown, genreId?: number): never {
    if (isForeignKeyViolation(error)) {
      throw new BadRequestException(`Genre ${genreId} does not exist`);
    }

    if (isCheckViolation(error)) {
      throw new BadRequestException('A numeric value is out of range');
    }

    throw error;
  }
}
