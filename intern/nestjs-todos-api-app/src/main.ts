import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';

import { swaggerOptions } from '../config/swagger.config';
import { EntityNotFoundErrorFilter } from './shared/filters/exceptions/entity-not-found.filter';

import { AppModule } from './app.module';

const port = process.env.PORT || 3000;
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // App config
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new EntityNotFoundErrorFilter());

  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  // Swagger/OpenAPI config
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/api/v1/docs', app, document);

  // Start express server
  await app.listen(port);
  Logger.log(`Server running on http://localhost:${port}  🚀 👌`, 'bootstrap()');

  // Webpack HMR
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
