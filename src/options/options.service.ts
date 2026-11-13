import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { Option } from './entities/option.entity.js';

const OPTION_COLUMNS = `id, name, description, created_at AS "createdAt",
  updated_at AS "updatedAt"`;

@Injectable()
export class OptionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Option[]> {
    const result = await this.db.query<Option>(
      `SELECT ${OPTION_COLUMNS} FROM options ORDER BY created_at, id`,
    );

    return result.rows;
  }

  async findOne(id: string): Promise<Option> {
    const result = await this.db.query<Option>(
      `SELECT ${OPTION_COLUMNS} FROM options WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Option "${id}" not found`);
    }

    return result.rows[0];
  }
}
