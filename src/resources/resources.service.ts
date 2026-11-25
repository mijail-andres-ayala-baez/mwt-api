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
import type { CreateResourceDto } from './dto/create-resource.dto.js';
import type { UpdateResourceDto } from './dto/update-resource.dto.js';
import type { Resource } from './entities/resource.entity.js';

// BIGINT comes back from pg as a string, so it is cast to a plain number
const RESOURCE_COLUMNS = `id, title, description, file_url AS "fileUrl",
  thumbnail_url AS "thumbnailUrl",
  file_size_bytes::double precision AS "fileSizeBytes",
  file_type AS "fileType", difficulty_level AS "difficultyLevel",
  genre_id AS "genreId", instrument, attachments,
  sort_order AS "sortOrder", created_at AS "createdAt",
  updated_at AS "updatedAt"`;

export interface ResourceFilters {
  genreId?: number;
  instrument?: string;
  difficultyLevel?: string;
}

@Injectable()
export class ResourcesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(filters: ResourceFilters = {}): Promise<Resource[]> {
    // A filter that was not sent is NULL, and "$1 IS NULL" makes it match everything
    const result = await this.db.query<Resource>(
      `SELECT ${RESOURCE_COLUMNS} FROM resources
       WHERE ($1::int IS NULL OR genre_id = $1)
         AND ($2::text IS NULL OR instrument = $2)
         AND ($3::text IS NULL OR difficulty_level = $3)
       ORDER BY sort_order, id`,
      [
        filters.genreId ?? null,
        filters.instrument ?? null,
        filters.difficultyLevel ?? null,
      ],
    );

    return result.rows;
  }

  async findOne(id: number): Promise<Resource> {
    const result = await this.db.query<Resource>(
      `SELECT ${RESOURCE_COLUMNS} FROM resources WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Resource ${id} not found`);
    }

    return result.rows[0];
  }

  async create(dto: CreateResourceDto): Promise<Resource> {
    try {
      const result = await this.db.query<Resource>(
        `INSERT INTO resources (title, description, file_url, thumbnail_url,
           file_size_bytes, file_type, difficulty_level, genre_id, instrument,
           attachments, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,
           COALESCE($10::jsonb, '[]'::jsonb), COALESCE($11, 0))
         RETURNING ${RESOURCE_COLUMNS}`,
        [
          dto.title,
          dto.description,
          dto.fileUrl,
          dto.thumbnailUrl,
          dto.fileSizeBytes,
          dto.fileType,
          dto.difficultyLevel,
          dto.genreId,
          dto.instrument,
          dto.attachments ? JSON.stringify(dto.attachments) : null,
          dto.sortOrder,
        ],
      );

      return result.rows[0];
    } catch (error) {
      this.rethrowKnownErrors(error, dto.genreId);
    }
  }

  async update(id: number, dto: UpdateResourceDto): Promise<Resource> {
    try {
      // COALESCE keeps the stored value for every field the client did not send
      const result = await this.db.query<Resource>(
        `UPDATE resources
         SET title = COALESCE($2, title),
             description = COALESCE($3, description),
             file_url = COALESCE($4, file_url),
             thumbnail_url = COALESCE($5, thumbnail_url),
             file_size_bytes = COALESCE($6, file_size_bytes),
             file_type = COALESCE($7, file_type),
             difficulty_level = COALESCE($8, difficulty_level),
             genre_id = COALESCE($9, genre_id),
             instrument = COALESCE($10, instrument),
             attachments = COALESCE($11::jsonb, attachments),
             sort_order = COALESCE($12, sort_order),
             updated_at = NOW()
         WHERE id = $1
         RETURNING ${RESOURCE_COLUMNS}`,
        [
          id,
          dto.title,
          dto.description,
          dto.fileUrl,
          dto.thumbnailUrl,
          dto.fileSizeBytes,
          dto.fileType,
          dto.difficultyLevel,
          dto.genreId,
          dto.instrument,
          dto.attachments ? JSON.stringify(dto.attachments) : null,
          dto.sortOrder,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Resource ${id} not found`);
      }

      return result.rows[0];
    } catch (error) {
      this.rethrowKnownErrors(error, dto.genreId);
    }
  }

  async remove(id: number): Promise<void> {
    const result = await this.db.query('DELETE FROM resources WHERE id = $1', [
      id,
    ]);

    if (result.rowCount === 0) {
      throw new NotFoundException(`Resource ${id} not found`);
    }
  }

  private rethrowKnownErrors(error: unknown, genreId?: number): never {
    if (isForeignKeyViolation(error)) {
      throw new BadRequestException(`Genre ${genreId} does not exist`);
    }

    if (isCheckViolation(error)) {
      throw new BadRequestException('A numeric value is out of range');
    }

    throw error;
  }
}
