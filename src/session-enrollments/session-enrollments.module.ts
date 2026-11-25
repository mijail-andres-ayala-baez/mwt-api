import { Module } from '@nestjs/common';
import { SessionEnrollmentsController } from './session-enrollments.controller.js';
import { SessionEnrollmentsService } from './session-enrollments.service.js';

@Module({
  controllers: [SessionEnrollmentsController],
  providers: [SessionEnrollmentsService],
})
export class SessionEnrollmentsModule {}
