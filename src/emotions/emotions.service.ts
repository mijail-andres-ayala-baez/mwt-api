import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import type { Emotion } from './entities/emotion.entity.js';

// Each emotion comes with its words packed in a JSON list ([] when it has none)
const EMOTION_SELECT = `SELECT e.id, e.name, e.strong_color AS "strongColor",
  e.soft_color AS "softColor",
  COALESCE(
    json_agg(json_build_object('id', w.id, 'word', w.word) ORDER BY w.id)
      FILTER (WHERE w.id IS NOT NULL),
    '[]'::json
  ) AS words
  FROM emotions e
  LEFT JOIN emotion_words w ON w.emotion_id = e.id`;

@Injectable()
export class EmotionsService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<Emotion[]> {
    const result = await this.db.query<Emotion>(
      `${EMOTION_SELECT} GROUP BY e.id ORDER BY e.created_at, e.id`,
    );

    return result.rows;
  }

  async findOne(id: string): Promise<Emotion> {
    const result = await this.db.query<Emotion>(
      `${EMOTION_SELECT} WHERE e.id = $1 GROUP BY e.id`,
      [id],
    );

    if (result.rows.length === 0) {
      throw new NotFoundException(`Emotion "${id}" not found`);
    }

    return result.rows[0];
  }
}
