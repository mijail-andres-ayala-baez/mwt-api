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
import type { CreateUserSessionDto } from './dto/create-user-session.dto.js';
import type { UpdateUserSessionDto } from './dto/update-user-session.dto.js';
import type { UserSession } from './entities/user-session.entity.js';

// BIGINT comes back from pg as a string, so it is cast to a plain number
const USER_SESSION_COLUMNS = `id, session_id AS "sessionId", user_id AS "userId",
  file_url AS "fileUrl", file_type AS "fileType",
  file_size_bytes::double precision AS "fileSizeBytes",
  upload_status AS "uploadStatus", activity_type AS "activityType",
  original_filename AS "originalFilename", mime_type AS "mimeType",
  duration_seconds AS "durationSeconds", description,
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export interface UserSessionFilters {
  userId?: number;
  sessionId?: number;
}

// Turns the database errors we expect into clear HTTP answers
function translateError(error: unknown): unknown {
  if (isForeignKeyViolation(error)) {
    return new BadRequestException('userId or sessionId does not exist');
  }

  if (isCheckViolation(error)) {
    return new BadRequestException('A numeric value is out of range');
  }

  return error;
}

@Injectable()
export class UserSessionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: UserSessionFilters = {}): Promise<UserSession[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<UserSession>(
      `SELECT ${USER_SESSION_COLUMNS} FROM user_sessions
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR session_id = $2)
       ORDER BY id`,
      [filters.userId ?? null, filters.sessionId ?? null],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<UserSession> {
    const result = await this.db.query<UserSession>(
      `SELECT ${USER_SESSION_COLUMNS} FROM user_sessions WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`User session ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateUserSessionDto): Promise<UserSession> {
    try {
      const result = await this.db.query<UserSession>(
        `INSERT INTO user_sessions (session_id, user_id, file_url, file_type,
           file_size_bytes, upload_status, activity_type, original_filename,
           mime_type, duration_seconds, description)
         VALUES ($1, $2, $3, $4, $5, COALESCE($6, 'pending'), $7, $8, $9, $10, $11)
         RETURNING ${USER_SESSION_COLUMNS}`,
        [
          dto.sessionId,
          dto.userId,
          dto.fileUrl,
          dto.fileType,
          dto.fileSizeBytes,
          dto.uploadStatus,
          dto.activityType,
          dto.originalFilename,
          dto.mimeType,
          dto.durationSeconds,
          dto.description,
        ],
      );

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async update(id: number, dto: UpdateUserSessionDto): Promise<UserSession> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<UserSession>(
        `UPDATE user_sessions
         SET session_id = COALESCE($2, session_id),
             user_id = COALESCE($3, user_id),
             file_url = COALESCE($4, file_url),
             file_type = COALESCE($5, file_type),
             file_size_bytes = COALESCE($6, file_size_bytes),
             upload_status = COALESCE($7, upload_status),
             activity_type = COALESCE($8, activity_type),
             original_filename = COALESCE($9, original_filename),
             mime_type = COALESCE($10, mime_type),
             duration_seconds = COALESCE($11, duration_seconds),
             description = COALESCE($12, description),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${USER_SESSION_COLUMNS}`,
        [
          id,
          dto.sessionId,
          dto.userId,
          dto.fileUrl,
          dto.fileType,
          dto.fileSizeBytes,
          dto.uploadStatus,
          dto.activityType,
          dto.originalFilename,
          dto.mimeType,
          dto.durationSeconds,
          dto.description,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`User session ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM user_sessions WHERE id = $1',
      [id],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException(`User session ${id} not found`);
    }
  }
}
