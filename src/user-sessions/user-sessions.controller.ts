import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserSessionDto } from './dto/create-user-session.dto.js';
import { UpdateUserSessionDto } from './dto/update-user-session.dto.js';
import { UserSessionsService } from './user-sessions.service.js';

// Every route in this class starts with /user-sessions
@Controller('user-sessions')
export class UserSessionsController {
  constructor(private readonly userSessionsService: UserSessionsService) {}

  // Optional filters: /user-sessions?userId=1&sessionId=2
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('sessionId', new ParseIntPipe({ optional: true }))
    sessionId?: number,
  ) {
    return this.userSessionsService.findAll({ userId, sessionId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userSessionsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateUserSessionDto) {
    return this.userSessionsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserSessionDto,
  ) {
    return this.userSessionsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userSessionsService.remove(id);
  }
}
