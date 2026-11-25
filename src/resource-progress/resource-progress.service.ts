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
import type { SaveResourceProgressDto } from './dto/save-resource-progress.dto.js';
import type {
  ResourceProgress,
  ResourceProgressSummary,
} from './entities/resource-progress.entity.js';

// NUMERIC comes back from pg as a string, so it is cast to a plain number
const PROGRESS_COLUMNS = `id, user_id AS "userId", resource_id AS "resourceId",
  is_viewed AS "isViewed", viewed_at AS "viewedAt", view_count AS "viewCount",
  viewed_percentage::double precision AS "viewedPercentage",
  viewed_duration_seconds AS "viewedDurationSeconds",
  last_position_seconds AS "lastPositionSeconds",
  total_view_time_seconds AS "totalViewTimeSeconds",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export interface ResourceProgressFilters {
  userId?: number;
  resourceId?: number;
}

@Injectable()
export class ResourceProgressService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(
    filters: ResourceProgressFilters = {},
  ): Promise<ResourceProgress[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<ResourceProgress>(
      `SELECT ${PROGRESS_COLUMNS} FROM resource_progress
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR resource_id = $2)
       ORDER BY id`,
      [filters.userId ?? null, filters.resourceId ?? null],
    );

    return result.rows;
  }

  async save(dto: SaveResourceProgressDto): Promise<ResourceProgress> {
    try {
      // Creates the row the first time and updates it afterwards (upsert).
      // The percentage only goes up, and viewed_at is set the first time the
      // resource is marked as viewed.
      const result = await this.db.query<ResourceProgress>(
        `INSERT INTO resource_progress AS rp (
           user_id, resource_id, is_viewed, viewed_at, view_count,
           viewed_percentage, viewed_duration_seconds, last_position_seconds,
           total_view_time_seconds)
         VALUES (
           $1, $2, COALESCE($3::boolean, FALSE),
           CASE WHEN COALESCE($3::boolean, FALSE) THEN NOW() END,
           CASE WHEN COALESCE($8::boolean, FALSE) THEN 1 ELSE 0 END,
           COALESCE($4::numeric, 0), COALESCE($5::int, 0),
           COALESCE($6::int, 0), COALESCE($7::int, 0))
         ON CONFLICT (user_id, resource_id) DO UPDATE SET
           is_viewed = COALESCE($3::boolean, rp.is_viewed),
           viewed_at = CASE
             WHEN COALESCE($3::boolean, rp.is_viewed)
               THEN COALESCE(rp.viewed_at, NOW())
             ELSE NULL
           END,
           view_count = rp.view_count
             + CASE WHEN COALESCE($8::boolean, FALSE) THEN 1 ELSE 0 END,
           viewed_percentage = GREATEST(
             rp.viewed_percentage, COALESCE($4::numeric, 0)),
           viewed_duration_seconds = COALESCE(
             $5::int, rp.viewed_duration_seconds),
           last_position_seconds = COALESCE($6::int, rp.last_position_seconds),
           total_view_time_seconds = COALESCE(
             $7::int, rp.total_view_time_seconds),
           updated_at = NOW()
         RETURNING ${PROGRESS_COLUMNS}`,
        [
          dto.userId,
          dto.resourceId,
          dto.isViewed,
          dto.viewedPercentage,
          dto.viewedDurationSeconds,
          dto.lastPositionSeconds,
          dto.totalViewTimeSeconds,
          dto.countView,
        ],
      );

      return result.rows[0];
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException('userId or resourceId does not exist');
      }

      if (isCheckViolation(error)) {
        throw new BadRequestException('A numeric value is out of range');
      }

      throw error;
    }
  }

  async summary(
    userId: number,
    genreId?: number,
  ): Promise<ResourceProgressSummary> {
    const user = await this.db.query('SELECT 1 FROM users WHERE id = $1', [
      userId,
    ]);

    if (user.rows.length === 0) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const result = await this.db.query<{ total: number; viewed: number }>(
      `SELECT COUNT(r.id)::int AS total,
              COUNT(rp.id) FILTER (WHERE rp.is_viewed)::int AS viewed
       FROM resources r
       LEFT JOIN resource_progress rp
         ON rp.resource_id = r.id AND rp.user_id = $1
       WHERE ($2::int IS NULL OR r.genre_id = $2)`,
      [userId, genreId ?? null],
    );

    const { total, viewed } = result.rows[0];

    return {
      userId,
      totalResources: total,
      viewedResources: viewed,
      percentage: total === 0 ? 0 : Math.round((viewed / total) * 1000) / 10,
    };
  }
}
