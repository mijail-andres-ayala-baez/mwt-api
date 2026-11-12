import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DatabaseModule } from './database/database.module.js';
import { GenresModule } from './genres/genres.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { TeachersModule } from './teachers/teachers.module.js';
import { UsersModule } from './users/users.module.js';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
