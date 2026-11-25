import { Module } from '@nestjs/common';
import { TheoryResultsController } from './theory-results.controller.js';
import { TheoryResultsService } from './theory-results.service.js';

@Module({
  controllers: [TheoryResultsController],
  providers: [TheoryResultsService],
})
export class TheoryResultsModule {}
