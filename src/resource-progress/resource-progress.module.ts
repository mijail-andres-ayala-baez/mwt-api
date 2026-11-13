import { Module } from '@nestjs/common';
import { ResourceProgressController } from './resource-progress.controller.js';
import { ResourceProgressService } from './resource-progress.service.js';

@Module({
  controllers: [ResourceProgressController],
  providers: [ResourceProgressService],
})
export class ResourceProgressModule {}
