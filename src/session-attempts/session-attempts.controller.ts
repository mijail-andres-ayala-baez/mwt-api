import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSessionAttemptDto } from './dto/create-session-attempt.dto.js';
import { UpdateSessionAttemptDto } from './dto/update-session-attempt.dto.js';
import { SessionAttemptsService } from './session-attempts.service.js';

// Every route in this class starts with /session-attempts
@Controller('session-attempts')
export class SessionAttemptsController {
  constructor(private readonly attemptsService: SessionAttemptsService) {}

  // Optional filters: /session-attempts?userId=1&sessionId=box-breathing
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('sessionId') sessionId?: string,
  ) {
    return this.attemptsService.findAll({ userId, sessionId });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attemptsService.findOne(id);
  }

  // When the user starts a session (or once at the end, with everything)
  @Post()
  create(@Body() dto: CreateSessionAttemptDto) {
    return this.attemptsService.create(dto);
  }

  // When the user finishes the session or answers the final questions
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionAttemptDto,
  ) {
    return this.attemptsService.update(id, dto);
  }
}
