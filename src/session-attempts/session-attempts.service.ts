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
import type { CreateSessionAttemptDto } from './dto/create-session-attempt.dto.js';
import type { UpdateSessionAttemptDto } from './dto/update-session-attempt.dto.js';
import type { SessionAttempt } from './entities/session-attempt.entity.js';

const ATTEMPT_COLUMNS = `id, user_id AS "userId", session_id AS "sessionId",
  started_at AS "startedAt", finished_at AS "finishedAt", completed, score,
  details, feeling_after AS "feelingAfter", would_repeat AS "wouldRepeat"`;

export interface SessionAttemptFilters {
  userId?: number;
  sessionId?: string;
}

// JSONB goes as JSON text; undefined stays undefined so COALESCE keeps the old value
function toJson(value: unknown): string | undefined {
  return value === undefined ? undefined : JSON.stringify(value);
}

function translateError(error: unknown): unknown {
  if (isForeignKeyViolation(error)) {
    return new BadRequestException('userId or sessionId does not exist');
  }

  if (isCheckViolation(error)) {
    return new BadRequestException(
      'finishedAt is before startedAt or a value is out of range',
    );
  }

  return error;
}

@Injectable()
export class SessionAttemptsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(
    filters: SessionAttemptFilters = {},
  ): Promise<SessionAttempt[]> {
    const result = await this.db.query<SessionAttempt>(
      `SELECT ${ATTEMPT_COLUMNS} FROM session_attempts
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::text IS NULL OR session_id = $2)
       ORDER BY started_at DESC, id DESC`,
      [filters.userId ?? null, filters.sessionId ?? null],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<SessionAttempt> {
    const result = await this.db.query<SessionAttempt>(
      `SELECT ${ATTEMPT_COLUMNS} FROM session_attempts WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Session attempt ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateSessionAttemptDto): Promise<SessionAttempt> {
    try {
      const result = await this.db.query<SessionAttempt>(
        `INSERT INTO session_attempts (user_id, session_id, started_at,
           finished_at, completed, score, details, feeling_after, would_repeat)
         VALUES ($1, $2, COALESCE($3::timestamptz, NOW()), $4,
           COALESCE($5::boolean, FALSE), $6, $7::jsonb, $8, $9)
         RETURNING ${ATTEMPT_COLUMNS}`,
        [
          dto.userId,
          dto.sessionId,
          dto.startedAt,
          dto.finishedAt,
          dto.completed,
          dto.score,
          toJson(dto.details),
          dto.feelingAfter,
          dto.wouldRepeat,
        ],
      );

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async update(
    id: number,
    dto: UpdateSessionAttemptDto,
  ): Promise<SessionAttempt> {
    try {
      const result = await this.db.query<SessionAttempt>(
        `UPDATE session_attempts
         SET started_at = COALESCE($2::timestamptz, started_at),
             finished_at = COALESCE($3::timestamptz, finished_at),
             completed = COALESCE($4::boolean, completed),
             score = COALESCE($5::int, score),
             details = COALESCE($6::jsonb, details),
             feeling_after = COALESCE($7, feeling_after),
             would_repeat = COALESCE($8::boolean, would_repeat)
         WHERE id = $1
         RETURNING ${ATTEMPT_COLUMNS}`,
        [
          id,
          dto.startedAt,
          dto.finishedAt,
          dto.completed,
          dto.score,
          toJson(dto.details),
          dto.feelingAfter,
          dto.wouldRepeat,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Session attempt ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }
}
