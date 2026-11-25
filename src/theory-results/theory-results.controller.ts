import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { SaveTheoryResultDto } from './dto/save-theory-result.dto.js';
import { TheoryResultsService } from './theory-results.service.js';

// Every route in this class starts with /theory-results
@Controller('theory-results')
export class TheoryResultsController {
  constructor(private readonly resultsService: TheoryResultsService) {}

  // Optional filters: /theory-results?userId=1&genreId=2
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('genreId', new ParseIntPipe({ optional: true })) genreId?: number,
  ) {
    return this.resultsService.findAll({ userId, genreId });
  }

  // Creates or updates the result of one user on one activity or question
  @Put()
  @HttpCode(200)
  save(@Body() dto: SaveTheoryResultDto) {
    return this.resultsService.save(dto);
  }
}
