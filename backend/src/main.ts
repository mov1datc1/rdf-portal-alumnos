import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded, static as expressStatic } from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow React frontend to access
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  // Serve static assets from frontend/public as backup
  const publicDir = path.resolve(process.cwd(), '../frontend/public');
  app.use(expressStatic(publicDir));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
