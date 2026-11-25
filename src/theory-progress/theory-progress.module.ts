import { Module } from '@nestjs/common';
import { TheoryProgressController } from './theory-progress.controller.js';
import { TheoryProgressService } from './theory-progress.service.js';

@Module({
  controllers: [TheoryProgressController],
  providers: [TheoryProgressService],
})
export class TheoryProgressModule {}
