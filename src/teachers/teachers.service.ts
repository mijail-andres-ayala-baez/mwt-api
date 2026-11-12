import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  isForeignKeyViolation,
  isUniqueViolation,
} from '../database/pg-errors.js';
import type { CreateTeacherDto } from './dto/create-teacher.dto.js';
import type { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import type { Teacher } from './entities/teacher.entity.js';

// Database columns are snake_case; "AS" renames them to the camelCase the API returns
const TEACHER_COLUMNS = `id, name, email, profile_image_url AS "profileImageUrl",
  bio, specialty, created_at AS "createdAt", updated_at AS "updatedAt"`;

@Injectable()
export class TeachersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Teacher[]> {
    const result = await this.db.query<Teacher>(
      `SELECT ${TEACHER_COLUMNS} FROM teachers ORDER BY id`,
    );

    return result.rows;
  }

  async findOne(id: number): Promise<Teacher> {
    const result = await this.db.query<Teacher>(
      `SELECT ${TEACHER_COLUMNS} FROM teachers WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Teacher ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateTeacherDto): Promise<Teacher> {
    try {
      const result = await this.db.query<Teacher>(
        `INSERT INTO teachers (name, email, profile_image_url, bio, specialty)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING ${TEACHER_COLUMNS}`,
        [dto.name, dto.email, dto.profileImageUrl, dto.bio, dto.specialty],
      );

      return result.rows[0];
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }

      throw error;
    }
  }

  async update(id: number, dto: UpdateTeacherDto): Promise<Teacher> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<Teacher>(
        `UPDATE teachers
         SET name = COALESCE($2, name),
             email = COALESCE($3, email),
             profile_image_url = COALESCE($4, profile_image_url),
             bio = COALESCE($5, bio),
             specialty = COALESCE($6, specialty),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${TEACHER_COLUMNS}`,
        [id, dto.name, dto.email, dto.profileImageUrl, dto.bio, dto.specialty],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Teacher ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(`Email "${dto.email}" is already in use`);
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.db.query('DELETE FROM teachers WHERE id = $1', [
        id,
      ]);

      if (result.rowCount === 0) {
        throw new NotFoundException(`Teacher ${id} not found`);
      }
    } catch (error) {
      if (isForeignKeyViolation(error)) {
        throw new ConflictException(
          `Teacher ${id} still has sessions and cannot be deleted`,
        );
      }

      throw error;
    }
  }
}
