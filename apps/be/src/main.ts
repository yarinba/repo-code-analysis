import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import { ZodFilter } from './exceptions/zod-filter.exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      credentials: true,
    },
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new ZodFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  const url = await app.getUrl();

  Logger.log(`🚀 application is listening at ${url}`);
}

bootstrap();
