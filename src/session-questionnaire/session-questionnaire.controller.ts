import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateSessionQuestionnaireDto } from './dto/create-session-questionnaire.dto.js';
import { SessionQuestionnaireService } from './session-questionnaire.service.js';

// Every route in this class starts with /session-questionnaire
@Controller('session-questionnaire')
export class SessionQuestionnaireController {
  constructor(
    private readonly questionnaireService: SessionQuestionnaireService,
  ) {}

  // Optional filter: /session-questionnaire?userId=1 (newest first)
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
  ) {
    return this.questionnaireService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.questionnaireService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSessionQuestionnaireDto) {
    return this.questionnaireService.create(dto);
  }
}
