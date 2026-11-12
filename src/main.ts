import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Applies the DTO rules to every request in the whole app
  app.useGlobalPipes(
    new ValidationPipe({
      // Silently drops properties that are not in the DTO...
      whitelist: true,
      // ...and, together with this option, rejects the request instead
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
