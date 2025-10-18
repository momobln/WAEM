import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ZodValidationPipe } from './common/zod-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe({ transform: true }));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Server is running on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
