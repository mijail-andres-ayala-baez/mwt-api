import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service.js';

// Global: any module can inject DatabaseService without importing DatabaseModule again
@Global()
@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
