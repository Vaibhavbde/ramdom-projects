import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
    .setTitle('Nestjs Todos')
    .setDescription('Documentation for the Nestjs Todos Example API')
    .setVersion('0.0.1')
    .setBasePath('api/v1')
    .addBearerAuth()
    .addTag('todos')
    .addTag('auth')
    .addTag('users')
    .build();
