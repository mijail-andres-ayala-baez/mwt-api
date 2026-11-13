import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BranchesModule } from './branches/branches.module.js';
import { DatabaseModule } from './database/database.module.js';
import { EmotionsModule } from './emotions/emotions.module.js';
import { GenresModule } from './genres/genres.module.js';
import { OptionsModule } from './options/options.module.js';
import { ResourceProgressModule } from './resource-progress/resource-progress.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { SessionEnrollmentsModule } from './session-enrollments/session-enrollments.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { UserSessionsModule } from './user-sessions/user-sessions.module.js';
import { UsersModule } from './users/users.module.js';
import { VideoProgressModule } from './video-progress/video-progress.module.js';
import { VideosModule } from './videos/videos.module.js';

@Module({
  imports: [
    // Reads the .env file and makes its variables available app-wide
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    GenresModule,
    TeachersModule,
    UsersModule,
    SessionsModule,
    ResourcesModule,
    VideosModule,
    SessionEnrollmentsModule,
    UserSessionsModule,
    ResourceProgressModule,
    VideoProgressModule,
    OptionsModule,
    BranchesModule,
    EmotionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
