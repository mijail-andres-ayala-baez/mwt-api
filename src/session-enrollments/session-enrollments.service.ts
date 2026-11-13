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
import type { CreateSessionEnrollmentDto } from './dto/create-session-enrollment.dto.js';
import type { UpdateSessionEnrollmentDto } from './dto/update-session-enrollment.dto.js';
import type { SessionEnrollment } from './entities/session-enrollment.entity.js';

const ENROLLMENT_COLUMNS = `id, user_id AS "userId", session_id AS "sessionId",
  enrollment_number AS "enrollmentNumber", enrolled_at AS "enrolledAt",
  unenrolled_at AS "unenrolledAt", status,
  attendance_status AS "attendanceStatus",
  feedback_rating AS "feedbackRating",
  feedback_comments AS "feedbackComments",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

export interface EnrollmentFilters {
  userId?: number;
  sessionId?: number;
  status?: string;
}

@Injectable()
export class SessionEnrollmentsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: EnrollmentFilters = {}): Promise<SessionEnrollment[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<SessionEnrollment>(
      `SELECT ${ENROLLMENT_COLUMNS} FROM session_enrollments
       WHERE ($1::int IS NULL OR user_id = $1)
         AND ($2::int IS NULL OR session_id = $2)
         AND ($3::text IS NULL OR status = $3)
       ORDER BY id`,
      [
        filters.userId ?? null,
        filters.sessionId ?? null,
        filters.status ?? null,
      ],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<SessionEnrollment> {
    const result = await this.db.query<SessionEnrollment>(
      `SELECT ${ENROLLMENT_COLUMNS} FROM session_enrollments WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Enrollment ${id} not found`);
    }

    return result.rows[0];
  }

  async enroll(dto: CreateSessionEnrollmentDto): Promise<SessionEnrollment> {
    try {
      // One single statement: it takes a free place in the session and creates
      // the enrollment, or does nothing at all (so the counter never drifts)
      const result = await this.db.query<SessionEnrollment>(
        `WITH slot AS (
           UPDATE sessions
           SET current_students = current_students + 1, updated_at = NOW()
           WHERE id = $2
             AND current_students < max_students
             AND NOT EXISTS (
               SELECT 1 FROM session_enrollments
               WHERE user_id = $1 AND session_id = $2 AND status = 'enrolled'
             )
           RETURNING current_students
         )
         INSERT INTO session_enrollments (user_id, session_id, enrollment_number)
         SELECT $1, $2, current_students FROM slot
         RETURNING ${ENROLLMENT_COLUMNS}`,
        [dto.userId, dto.sessionId],
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException('userId does not exist');
      }

      throw error;
    }

    // Nothing was created: find out why, to answer with the right error
    throw await this.explainFailedEnrollment(dto);
  }

  async cancel(id: number): Promise<SessionEnrollment> {
    // Marks the enrollment as cancelled and frees the place, in one statement
    const result = await this.db.query<SessionEnrollment>(
      `WITH cancelled AS (
         UPDATE session_enrollments
         SET status = 'cancelled', unenrolled_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND status = 'enrolled'
         RETURNING *
       ), freed AS (
         UPDATE sessions
         SET current_students = current_students - 1, updated_at = NOW()
         WHERE id IN (SELECT session_id FROM cancelled)
       )
       SELECT ${ENROLLMENT_COLUMNS} FROM cancelled`,
      [id],
    );

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // Not cancelled: either it does not exist or it was already cancelled
    await this.findOne(id);
    throw new ConflictException(`Enrollment ${id} is already cancelled`);
  }

  async update(
    id: number,
    dto: UpdateSessionEnrollmentDto,
  ): Promise<SessionEnrollment> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<SessionEnrollment>(
        `UPDATE session_enrollments
         SET attendance_status = COALESCE($2, attendance_status),
             feedback_rating = COALESCE($3, feedback_rating),
             feedback_comments = COALESCE($4, feedback_comments),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${ENROLLMENT_COLUMNS}`,
        [id, dto.attendanceStatus, dto.feedbackRating, dto.feedbackComments],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Enrollment ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      if (isCheckViolation(error)) {
        throw new BadRequestException('feedbackRating must be between 1 and 5');
      }

      throw error;
    }
  }

  private async explainFailedEnrollment(
    dto: CreateSessionEnrollmentDto,
  ): Promise<Error> {
    const user = await this.db.query('SELECT 1 FROM users WHERE id = $1', [
      dto.userId,
    ]);

    if (user.rows.length === 0) {
      return new BadRequestException('userId does not exist');
    }

    const session = await this.db.query<{ full: boolean }>(
      'SELECT current_students >= max_students AS "full" FROM sessions WHERE id = $1',
      [dto.sessionId],
    );

    if (session.rows.length === 0) {
      return new BadRequestException('sessionId does not exist');
    }

    if (session.rows[0].full) {
      return new ConflictException(`Session ${dto.sessionId} is full`);
    }

    return new ConflictException(
      `User ${dto.userId} is already enrolled in session ${dto.sessionId}`,
    );
  }
}
