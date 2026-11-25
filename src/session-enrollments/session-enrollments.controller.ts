import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSessionEnrollmentDto } from './dto/create-session-enrollment.dto.js';
import { UpdateSessionEnrollmentDto } from './dto/update-session-enrollment.dto.js';
import { SessionEnrollmentsService } from './session-enrollments.service.js';

// Every route in this class starts with /session-enrollments
@Controller('session-enrollments')
export class SessionEnrollmentsController {
  constructor(private readonly enrollmentsService: SessionEnrollmentsService) {}

  // Optional filters: /session-enrollments?userId=1&sessionId=2&status=enrolled
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('sessionId', new ParseIntPipe({ optional: true }))
    sessionId?: number,
    @Query('status') status?: string,
  ) {
    return this.enrollmentsService.findAll({ userId, sessionId, status });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.findOne(id);
  }

  @Post()
  enroll(@Body() dto: CreateSessionEnrollmentDto) {
    return this.enrollmentsService.enroll(dto);
  }

  // Un-enrolls the user and frees the place (the row is kept as history)
  @Post(':id/cancel')
  @HttpCode(200)
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.enrollmentsService.cancel(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSessionEnrollmentDto,
  ) {
    return this.enrollmentsService.update(id, dto);
  }
}
