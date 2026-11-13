import { Controller, Get, Param } from '@nestjs/common';
import { OptionsService } from './options.service.js';

// Read-only: the options are loaded from the seed file, not created by clients
@Controller('options')
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) {}

  @Get()
  findAll() {
    return this.optionsService.findAll();
  }

  // The id is the text slug, for example /options/relax
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.optionsService.findOne(id);
  }
}
