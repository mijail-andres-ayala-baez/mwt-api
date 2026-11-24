import { Controller, Get, Param, ParseBoolPipe, Query } from '@nestjs/common';
import { ExperimentalSessionsService } from './experimental-sessions.service.js';

// Read only: the list is loaded by db/017_seed_experimental_sessions.sql
@Controller('experimental-sessions')
export class ExperimentalSessionsController {
  constructor(private readonly sessionsService: ExperimentalSessionsService) {}

  // Optional filters: /experimental-sessions?branch=health&active=true
  @Get()
  findAll(
    @Query('branch') branch?: string,
    @Query('active', new ParseBoolPipe({ optional: true })) active?: boolean,
  ) {
    return this.sessionsService.findAll({ branch, active });
  }

  // The id is text, for example /experimental-sessions/box-breathing
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sessionsService.findOne(id);
  }
}
