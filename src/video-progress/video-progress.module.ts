import { Module } from '@nestjs/common';
import { VideoProgressController } from './video-progress.controller.js';
import { VideoProgressService } from './video-progress.service.js';

@Module({
  controllers: [VideoProgressController],
  providers: [VideoProgressService],
})
export class VideoProgressModule {}
