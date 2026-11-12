import { readFileSync } from 'node:fs';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  // A pool keeps several connections open and reuses them, which is much faster
  // than opening a new connection for every request
  private readonly pool: Pool;

  constructor(config: ConfigService) {
    // Only needed for AWS RDS: path to the RDS certificate bundle, which makes
    // the connection encrypted and checks that we talk to the real server
    const caPath = config.get<string>('DATABASE_SSL_CA');

    // getOrThrow stops the app at startup if the variable is missing
    this.pool = new Pool({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
      ssl: caPath ? { ca: readFileSync(caPath, 'utf8') } : undefined,
    });
  }

  // Always pass values in "params" ($1, $2...) and never glue them into the SQL text:
  // that is what protects against SQL injection
  query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
    return this.pool.query<T>(text, params);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
