import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseIntPipe,
  Put,
  Query,
} from '@nestjs/common';
import { SaveVideoProgressDto } from './dto/save-video-progress.dto.js';
import { VideoProgressService } from './video-progress.service.js';

// Every route in this class starts with /video-progress
@Controller('video-progress')
export class VideoProgressController {
  constructor(private readonly progressService: VideoProgressService) {}

  // Optional filters: /video-progress?userId=1&videoId=2
  @Get()
  findAll(
    @Query('userId', new ParseIntPipe({ optional: true })) userId?: number,
    @Query('videoId', new ParseIntPipe({ optional: true })) videoId?: number,
  ) {
    return this.progressService.findAll({ userId, videoId });
  }

  // Overall percentage of a user: /video-progress/summary?userId=1&genreId=2
  @Get('summary')
  summary(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('genreId', new ParseIntPipe({ optional: true })) genreId?: number,
  ) {
    return this.progressService.summary(userId, genreId);
  }

  // Creates or updates the progress of one user on one video
  @Put()
  @HttpCode(200)
  save(@Body() dto: SaveVideoProgressDto) {
    return this.progressService.save(dto);
  }
}
