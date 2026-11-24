import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { SaveTheoryProgressDto } from './dto/save-theory-progress.dto.js';
import { TheoryProgressService } from './theory-progress.service.js';

// Every route in this class starts with /theory-progress
@Controller('theory-progress')
export class TheoryProgressController {
  constructor(private readonly progressService: TheoryProgressService) {}

  // Optional filters: /theory-progress?userId=1&genreId=2
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('genreId', new ParseIntPipe({ optional: true })) genreId?: number,
  ) {
    return this.progressService.findAll({ userId, genreId });
  }

  // Saves the step reached; it never moves the progress backwards
  @Put()
  @HttpCode(200)
  save(@Body() dto: SaveTheoryProgressDto) {
    return this.progressService.save(dto);
  }
}
