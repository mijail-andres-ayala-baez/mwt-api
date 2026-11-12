import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isCheckViolation,
  isForeignKeyViolation,
} from '../database/pg-errors.js';
import type { CreateSessionDto } from './dto/create-session.dto.js';
import type { UpdateSessionDto } from './dto/update-session.dto.js';
import type { Session } from './entities/session.entity.js';

// Database columns are snake_case; "AS" renames them to the camelCase the API returns
const SESSION_COLUMNS = `id, title, description, teacher_id AS "teacherId",
  max_students AS "maxStudents", min_students AS "minStudents",
  current_students AS "currentStudents", status, session_type AS "sessionType",
  level, scheduled_date AS "scheduledDate", meeting_link AS "meetingLink",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

// Turns the database errors we expect into clear HTTP answers
function translateError(error: unknown): unknown {
  if (isForeignKeyViolation(error)) {
    return new BadRequestException('teacherId does not exist');
  }

  if (isCheckViolation(error)) {
    return new BadRequestException(
      'minStudents cannot be greater than maxStudents',
    );
  }

  return error;
}

@Injectable()
export class SessionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Session[]> {
    const result = await this.db.query<Session>(
      `SELECT ${SESSION_COLUMNS} FROM sessions ORDER BY scheduled_date, id`,
    );

    return result.rows;
  }

  async findOne(id: number): Promise<Session> {
    const result = await this.db.query<Session>(
      `SELECT ${SESSION_COLUMNS} FROM sessions WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Session ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateSessionDto): Promise<Session> {
    try {
      // COALESCE uses the column default when the client does not send a value
      const result = await this.db.query<Session>(
        `INSERT INTO sessions (title, description, teacher_id, max_students, min_students,
           status, session_type, level, scheduled_date, meeting_link)
         VALUES ($1, $2, $3, $4, COALESCE($5, 1), COALESCE($6, 'scheduled'), $7, $8, $9, $10)
         RETURNING ${SESSION_COLUMNS}`,
        [
          dto.title,
          dto.description,
          dto.teacherId,
          dto.maxStudents,
          dto.minStudents,
          dto.status,
          dto.sessionType,
          dto.level,
          dto.scheduledDate,
          dto.meetingLink,
        ],
      );

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async update(id: number, dto: UpdateSessionDto): Promise<Session> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<Session>(
        `UPDATE sessions
         SET title = COALESCE($2, title),
             description = COALESCE($3, description),
             teacher_id = COALESCE($4, teacher_id),
             max_students = COALESCE($5, max_students),
             min_students = COALESCE($6, min_students),
             status = COALESCE($7, status),
             session_type = COALESCE($8, session_type),
             level = COALESCE($9, level),
             scheduled_date = COALESCE($10, scheduled_date),
             meeting_link = COALESCE($11, meeting_link),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${SESSION_COLUMNS}`,
        [
          id,
          dto.title,
          dto.description,
          dto.teacherId,
          dto.maxStudents,
          dto.minStudents,
          dto.status,
          dto.sessionType,
          dto.level,
          dto.scheduledDate,
          dto.meetingLink,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Session ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.db.query('DELETE FROM sessions WHERE id = $1', [
        id,
      ]);

      if (result.rowCount === 0) {
        throw new NotFoundException(`Session ${id} not found`);
      }
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          `Session ${id} still has related data and cannot be deleted`,
        );
      }

      throw error;
    }
  }
}
