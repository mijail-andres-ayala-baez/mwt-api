import { Module } from '@nestjs/common';
import { UserSessionsController } from './user-sessions.controller.js';
import { UserSessionsService } from './user-sessions.service.js';

@Module({
  controllers: [UserSessionsController],
  providers: [UserSessionsService],
})
export class UserSessionsModule {}
