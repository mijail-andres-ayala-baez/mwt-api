import { Controller, Get, Param } from '@nestjs/common';
import { EmotionsService } from './emotions.service.js';

// Read-only: the emotions and their words are loaded from the seed file
@Controller('emotions')
export class EmotionsController {
  constructor(private readonly emotionsService: EmotionsService) {}

  @Get()
  findAll() {
    return this.emotionsService.findAll();
  }

  // The id is the text slug, for example /emotions/happiness
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emotionsService.findOne(id);
  }
}
