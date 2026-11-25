import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  // The auth module needs it to find or create the user of a token
  exports: [UsersService],
})
export class UsersModule {}
