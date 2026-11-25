import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Lets the front-end (another origin) call this API from the browser
  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? 'http://localhost:3000,http://localhost:3001'
  ).split(',');
  app.enableCors({ origin: allowedOrigins });

  // Interactive API documentation at /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MWT API')
    .setDescription('Back-end of the Music Well Tech web')
    .setVersion('0.1')
    .build();
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
