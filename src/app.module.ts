import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { ExperimentalSessionsModule } from './experimental-sessions/experimental-sessions.module.js';
import { GenresModule } from './genres/genres.module.js';
import { ResourceProgressModule } from './resource-progress/resource-progress.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { SessionAttemptsModule } from './session-attempts/session-attempts.module.js';
import { SessionEnrollmentsModule } from './session-enrollments/session-enrollments.module.js';
import { SessionQuestionnaireModule } from './session-questionnaire/session-questionnaire.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { TheoryProgressModule } from './theory-progress/theory-progress.module.js';
import { TheoryResultsModule } from './theory-results/theory-results.module.js';
import { UserSessionsModule } from './user-sessions/user-sessions.module.js';
import { UsersModule } from './users/users.module.js';
import { VideoProgressModule } from './video-progress/video-progress.module.js';
import { VideosModule } from './videos/videos.module.js';

@Module({
  imports: [
    // Reads the .env file and makes its variables available app-wide
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    // AuthModule (Cognito) stays out until we use AWS: with it, every route asks for a token
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
    // Experimental Sessions
    ExperimentalSessionsModule,
    SessionAttemptsModule,
    SessionQuestionnaireModule,
    // Theory Lab
    TheoryResultsModule,
    TheoryProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
