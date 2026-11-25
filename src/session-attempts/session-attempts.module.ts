import { Module } from '@nestjs/common';
import { SessionAttemptsController } from './session-attempts.controller.js';
import { SessionAttemptsService } from './session-attempts.service.js';

@Module({
  controllers: [SessionAttemptsController],
  providers: [SessionAttemptsService],
})
export class SessionAttemptsModule {}
