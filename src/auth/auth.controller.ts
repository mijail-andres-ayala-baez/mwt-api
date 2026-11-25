import { Controller, Get } from '@nestjs/common';
import type { User } from '../users/entities/user.entity.js';
import { CurrentUser } from './current-user.decorator.js';

// Every route in this class starts with /me
@Controller('me')
export class AuthController {
  // The signed-in user. The first call after signing up also creates the row in users
  @Get()
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
