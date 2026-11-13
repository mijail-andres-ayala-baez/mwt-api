import { Controller, Get, Param } from '@nestjs/common';
import { BranchesService } from './branches.service.js';

// Read-only: the branches are loaded from the seed file, not created by clients
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  findAll() {
    return this.branchesService.findAll();
  }

  // The id is the text slug, for example /branches/health
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }
}
