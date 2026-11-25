import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isCheckViolation,
  isForeignKeyViolation,
} from '../database/pg-errors.js';
import type { SaveTheoryProgressDto } from './dto/save-theory-progress.dto.js';
import type { TheoryProgress } from './entities/theory-progress.entity.js';

const PROGRESS_COLUMNS = `user_id AS "userId", genre_id AS "genreId",
  progress, updated_at AS "updatedAt"`;

export interface TheoryProgressFilters {
  userId?: number;
  genreId?: number;
}

@Injectable()
export class TheoryProgressService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(
    filters: TheoryProgressFilters = {},
  ): Promise<TheoryProgress[]> {
    const result = await this.db.query<TheoryProgress>(
      `SELECT ${PROGRESS_COLUMNS} FROM theory_progress
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR genre_id = $2)
       ORDER BY user_id, genre_id`,
      [filters.userId ?? null, filters.genreId ?? null],
    );

    return result.rows;
  }

  async save(dto: SaveTheoryProgressDto): Promise<TheoryProgress> {
    try {
      // Progress only moves forward. "1.1.10" is turned into the list
      // {1,1,10} so it compares as numbers: 1.1.10 is after 1.1.9
      const result = await this.db.query<TheoryProgress>(
        `INSERT INTO theory_progress AS tp (user_id, genre_id, progress)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, genre_id) DO UPDATE SET
           progress = EXCLUDED.progress,
           updated_at = NOW()
         WHERE string_to_array(EXCLUDED.progress, '.')::int[]
             > string_to_array(tp.progress, '.')::int[]
         RETURNING ${PROGRESS_COLUMNS}`,
        [dto.userId, dto.genreId, dto.progress],
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }

      // The new step was not ahead of the stored one: return the stored row
      const current = await this.db.query<TheoryProgress>(
        `SELECT ${PROGRESS_COLUMNS} FROM theory_progress
         WHERE user_id = $1 AND genre_id = $2`,
        [dto.userId, dto.genreId],
      );

      return current.rows[0];
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException('userId or genreId does not exist');
      }

      if (isCheckViolation(error)) {
        throw new BadRequestException('progress must look like 1.1.1');
      }

      throw error;
    }
  }
}
