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
import type { CreateSessionQuestionnaireDto } from './dto/create-session-questionnaire.dto.js';
import type { SessionQuestionnaire } from './entities/session-questionnaire.entity.js';

const QUESTIONNAIRE_COLUMNS = `id, user_id AS "userId", goal, minutes, words,
  recommended_session_id AS "recommendedSessionId", created_at AS "createdAt"`;

@Injectable()
export class SessionQuestionnaireService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(userId?: number): Promise<SessionQuestionnaire[]> {
    const result = await this.db.query<SessionQuestionnaire>(
      `SELECT ${QUESTIONNAIRE_COLUMNS} FROM session_questionnaire
       WHERE ($1::int IS NULL OR user_id = $1)
       ORDER BY created_at DESC, id DESC`,
      [userId ?? null],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<SessionQuestionnaire> {
    const result = await this.db.query<SessionQuestionnaire>(
      `SELECT ${QUESTIONNAIRE_COLUMNS} FROM session_questionnaire WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Questionnaire ${id} not found`);
    }

    return result.rows[0];
  }

  async create(
    dto: CreateSessionQuestionnaireDto,
  ): Promise<SessionQuestionnaire> {
    try {
      // pg sends a JavaScript array as a PostgreSQL array (TEXT[])
      const result = await this.db.query<SessionQuestionnaire>(
        `INSERT INTO session_questionnaire (user_id, goal, minutes, words,
           recommended_session_id)
         VALUES ($1, $2, $3, COALESCE($4::text[], '{}'), $5)
         RETURNING ${QUESTIONNAIRE_COLUMNS}`,
        [
          dto.userId,
          dto.goal,
          dto.minutes,
          dto.words,
          dto.recommendedSessionId,
        ],
      );

      return result.rows[0];
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new BadRequestException(
          'userId or recommendedSessionId does not exist',
        );
      }

      if (isCheckViolation(error)) {
        throw new BadRequestException('A value is not allowed');
      }

      throw error;
    }
  }
}
