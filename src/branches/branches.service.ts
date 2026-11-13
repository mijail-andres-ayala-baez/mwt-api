import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { Branch } from './entities/branch.entity.js';

const BRANCH_COLUMNS = `id, name, description, created_at AS "createdAt",
  updated_at AS "updatedAt"`;

@Injectable()
export class BranchesService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Branch[]> {
    const result = await this.db.query<Branch>(
      `SELECT ${BRANCH_COLUMNS} FROM branches ORDER BY created_at, id`,
    );

    return result.rows;
  }

  async findOne(id: string): Promise<Branch> {
    const result = await this.db.query<Branch>(
      `SELECT ${BRANCH_COLUMNS} FROM branches WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Branch "${id}" not found`);
    }

    return result.rows[0];
  }
}
