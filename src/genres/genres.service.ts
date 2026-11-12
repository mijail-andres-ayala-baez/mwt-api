import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { isUniqueViolation } from '../database/pg-errors.js';
import type { CreateGenreDto } from './dto/create-genre.dto.js';
import type { UpdateGenreDto } from './dto/update-genre.dto.js';
import type { Genre } from './entities/genre.entity.js';

// Database columns are snake_case; "AS" renames them to the camelCase the API returns
const GENRE_COLUMNS = `id, name, color_code AS "colorCode", icon_url AS "iconUrl",
  description, created_at AS "createdAt", updated_at AS "updatedAt"`;

@Injectable()
export class GenresService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Genre[]> {
    const result = await this.db.query<Genre>(
      `SELECT ${GENRE_COLUMNS} FROM genres ORDER BY id`,
    );

    return result.rows;
  }

  async findOne(id: number): Promise<Genre> {
    const result = await this.db.query<Genre>(
      `SELECT ${GENRE_COLUMNS} FROM genres WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Genre ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateGenreDto): Promise<Genre> {
    try {
      const result = await this.db.query<Genre>(
        `INSERT INTO genres (name, color_code, icon_url, description)
         VALUES ($1, $2, $3, $4)
         RETURNING ${GENRE_COLUMNS}`,
        [dto.name, dto.colorCode, dto.iconUrl, dto.description],
      );

      return result.rows[0];
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(`Genre "${dto.name}" already exists`);
      }

      throw error;
    }
  }

  async update(id: number, dto: UpdateGenreDto): Promise<Genre> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<Genre>(
        `UPDATE genres
         SET name = COALESCE($2, name),
             color_code = COALESCE($3, color_code),
             icon_url = COALESCE($4, icon_url),
             description = COALESCE($5, description),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${GENRE_COLUMNS}`,
        [id, dto.name, dto.colorCode, dto.iconUrl, dto.description],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Genre ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new ConflictException(`Genre "${dto.name}" already exists`);
      }

      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM genres WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException(`Genre ${id} not found`);
    }
  }
}
