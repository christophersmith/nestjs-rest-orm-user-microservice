import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SwaggerHelper } from './utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // enable class-validator for all input
  app.useGlobalPipes(new ValidationPipe());

  // configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('NestJS + TypeORM REST User Microservice')
    .setDescription('')
    .setVersion('0.0.1')
    .addTag(SwaggerHelper.TAG_USERS)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(3000);
}
bootstrap();
