import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { ExperimentalSession } from './entities/experimental-session.entity.js';

const SESSION_COLUMNS = 'id, branches, category, active';

export interface ExperimentalSessionFilters {
  branch?: string;
  active?: boolean;
}

@Injectable()
export class ExperimentalSessionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(
    filters: ExperimentalSessionFilters = {},
  ): Promise<ExperimentalSession[]> {
    // "= ANY(branches)" checks whether the branch is inside the list
    const result = await this.db.query<ExperimentalSession>(
      `SELECT ${SESSION_COLUMNS} FROM experimental_sessions
       WHERE ($1::text IS NULL OR $1 = ANY(branches))
         AND ($2::boolean IS NULL OR active = $2)
       ORDER BY id`,
      [filters.branch ?? null, filters.active ?? null],
    );

    return result.rows;
  }

  async findOne(id: string): Promise<ExperimentalSession> {
    const result = await this.db.query<ExperimentalSession>(
      `SELECT ${SESSION_COLUMNS} FROM experimental_sessions WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Experimental session ${id} not found`);
    }

    return result.rows[0];
  }
}
