import { Module } from '@nestjs/common';
import { ExperimentalSessionsController } from './experimental-sessions.controller.js';
import { ExperimentalSessionsService } from './experimental-sessions.service.js';

@Module({
  controllers: [ExperimentalSessionsController],
  providers: [ExperimentalSessionsService],
})
export class ExperimentalSessionsModule {}
