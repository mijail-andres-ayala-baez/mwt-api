import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { SaveResourceProgressDto } from './dto/save-resource-progress.dto.js';
import { ResourceProgressService } from './resource-progress.service.js';

// Every route in this class starts with /resource-progress
@Controller('resource-progress')
export class ResourceProgressController {
  constructor(private readonly progressService: ResourceProgressService) {}

  // Optional filters: /resource-progress?userId=1&resourceId=2
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('resourceId', new ParseIntPipe({ optional: true }))
    resourceId?: number,
  ) {
    return this.progressService.findAll({ userId, resourceId });
  }

  // Overall percentage of a user: /resource-progress/summary?userId=1&genreId=2
  @Get('summary')
  summary(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('genreId', new ParseIntPipe({ optional: true })) genreId?: number,
  ) {
    return this.progressService.summary(userId, genreId);
  }

  // Creates or updates the progress of one user on one resource
  @Put()
  @HttpCode(200)
  save(@Body() dto: SaveResourceProgressDto) {
    return this.progressService.save(dto);
  }
}
