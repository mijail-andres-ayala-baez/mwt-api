import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isForeignKeyViolation,
  isUniqueViolation,
} from '../database/pg-errors.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './entities/user.entity.js';

// Database columns are snake_case; "AS" renames them to the camelCase the API returns
const USER_COLUMNS = `id, cognito_id AS "cognitoId", name, surname, email, role, level,
  instrument, genre_id AS "genreId", phone_code AS "phoneCode",
  phone_number AS "phoneNumber", company, stage,
  questionnaire_completed AS "questionnaireCompleted",
  questionnaire_completed_at AS "questionnaireCompletedAt",
  created_at AS "createdAt", updated_at AS "updatedAt"`;

// Turns the database errors we expect into clear HTTP answers
function translateError(error: unknown): unknown {
  if (isUniqueViolation(error)) {
    return new ConflictException('Email or Cognito id is already in use');
  }

  if (isForeignKeyViolation(error)) {
    return new BadRequestException('genreId does not exist');
  }

  return error;
}

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<User[]> {
    const result = await this.db.query<User>(
      `SELECT ${USER_COLUMNS} FROM users ORDER BY id`,
    );

    return result.rows;
  }

  async findOne(id: number): Promise<User> {
    const result = await this.db.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateUserDto): Promise<User> {
    try {
      // COALESCE uses the column default when the client does not send a value
      const result = await this.db.query<User>(
        `INSERT INTO users (cognito_id, name, surname, email, role, level, instrument,
           genre_id, phone_code, phone_number, company, stage,
           questionnaire_completed, questionnaire_completed_at)
         VALUES ($1, $2, $3, $4, COALESCE($5, 'student'), $6, $7, $8, $9, $10, $11, $12,
           COALESCE($13, FALSE), $14)
         RETURNING ${USER_COLUMNS}`,
        [
          dto.cognitoId,
          dto.name,
          dto.surname,
          dto.email,
          dto.role,
          dto.level,
          dto.instrument,
          dto.genreId,
          dto.phoneCode,
          dto.phoneNumber,
          dto.company,
          dto.stage,
          dto.questionnaireCompleted,
          dto.questionnaireCompletedAt,
        ],
      );

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  // First sign-in: the account lives in Cognito, so the row in users is
  // created here from the data inside the token
  async findOrCreateByCognito(data: {
    cognitoId: string;
    name: string;
    email: string;
  }): Promise<User> {
    const existing = await this.findByCognitoId(data.cognitoId);

    if (existing) {
      return existing;
    }

    try {
      // DO NOTHING covers two requests creating the same user at the same time
      const result = await this.db.query<User>(
        `INSERT INTO users (cognito_id, name, email)
         VALUES ($1, $2, $3)
         ON CONFLICT (cognito_id) DO NOTHING
         RETURNING ${USER_COLUMNS}`,
        [data.cognitoId, data.name, data.email],
      );

      if (result.rows.length > 0) {
        return result.rows[0];
      }
    } catch (error) {
      throw translateError(error);
    }

    // Another request created the row first: read the one it made
    const created = await this.findByCognitoId(data.cognitoId);

    if (!created) {
      throw new ConflictException('The user could not be created');
    }

    return created;
  }

  private async findByCognitoId(cognitoId: string): Promise<User | undefined> {
    const result = await this.db.query<User>(
      `SELECT ${USER_COLUMNS} FROM users WHERE cognito_id = $1`,
      [cognitoId],
    );

    return result.rows[0];
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<User>(
        `UPDATE users
         SET cognito_id = COALESCE($2, cognito_id),
             name = COALESCE($3, name),
             surname = COALESCE($4, surname),
             email = COALESCE($5, email),
             role = COALESCE($6, role),
             level = COALESCE($7, level),
             instrument = COALESCE($8, instrument),
             genre_id = COALESCE($9, genre_id),
             phone_code = COALESCE($10, phone_code),
             phone_number = COALESCE($11, phone_number),
             company = COALESCE($12, company),
             stage = COALESCE($13, stage),
             questionnaire_completed = COALESCE($14, questionnaire_completed),
             questionnaire_completed_at = COALESCE($15, questionnaire_completed_at),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${USER_COLUMNS}`,
        [
          id,
          dto.cognitoId,
          dto.name,
          dto.surname,
          dto.email,
          dto.role,
          dto.level,
          dto.instrument,
          dto.genreId,
          dto.phoneCode,
          dto.phoneNumber,
          dto.company,
          dto.stage,
          dto.questionnaireCompleted,
          dto.questionnaireCompletedAt,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`User ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      throw translateError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.db.query('DELETE FROM users WHERE id = $1', [
        id,
      ]);

      if (result.rowCount === 0) {
        throw new NotFoundException(`User ${id} not found`);
      }
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          `User ${id} still has related data and cannot be deleted`,
        );
      }

      throw error;
    }
  }
}
