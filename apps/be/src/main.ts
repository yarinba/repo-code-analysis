/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app/app.module';
import { ZodFilter } from './exceptions/zod-filter.exception';

async function bootstrap() {
  // TODO: take care of the CORS policy
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalFilters(new ZodFilter());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
