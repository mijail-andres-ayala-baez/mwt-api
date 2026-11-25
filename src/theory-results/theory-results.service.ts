import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isCheckViolation,
  isForeignKeyViolation,
} from '../database/pg-errors.js';
import type { SaveTheoryResultDto } from './dto/save-theory-result.dto.js';
import type { TheoryResult } from './entities/theory-result.entity.js';

const RESULT_COLUMNS = `user_id AS "userId", genre_id AS "genreId",
  item_id AS "itemId", kind, completed, correct, answer, score,
  updated_at AS "updatedAt"`;

export interface TheoryResultFilters {
  userId?: number;
  genreId?: number;
}

@Injectable()
export class TheoryResultsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: TheoryResultFilters = {}): Promise<TheoryResult[]> {
    const result = await this.db.query<TheoryResult>(
      `SELECT ${RESULT_COLUMNS} FROM theory_results
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR genre_id = $2)
       ORDER BY user_id, genre_id, item_id`,
      [filters.userId ?? null, filters.genreId ?? null],
    );

    return result.rows;
  }

  async save(dto: SaveTheoryResultDto): Promise<TheoryResult> {
    // JSONB goes as JSON text, so a list is not mistaken for a PostgreSQL array
    const answer =
      dto.answer === undefined ? undefined : JSON.stringify(dto.answer);

    try {
      // Upsert: one row per user, genre and item. The answer, correct and
      // score are always the latest ones; completed never goes back to false
      const result = await this.db.query<TheoryResult>(
        `INSERT INTO theory_results AS tr (user_id, genre_id, item_id, kind,
           completed, correct, answer, score)
         VALUES ($1, $2, $3, $4, COALESCE($5::boolean, FALSE), $6, $7::jsonb, $8)
         ON CONFLICT (user_id, genre_id, item_id) DO UPDATE SET
           kind = EXCLUDED.kind,
           completed = tr.completed OR EXCLUDED.completed,
           correct = EXCLUDED.correct,
           answer = EXCLUDED.answer,
           score = EXCLUDED.score,
           updated_at = NOW()
         RETURNING ${RESULT_COLUMNS}`,
        [
          dto.userId,
          dto.genreId,
          dto.itemId,
          dto.kind,
          dto.completed,
          dto.correct,
          answer,
          dto.score,
        ],
      );

      return result.rows[0];
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException('userId or genreId does not exist');
      }

      if (isCheckViolation(error)) {
        throw new BadRequestException('A value is out of range');
      }

      throw error;
    }
  }
}
