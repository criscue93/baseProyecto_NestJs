import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.enableCors();

  app.use(express.json({ limit: process.env.APP_FILE_MAX_SIZE }));
  app.use(
    express.urlencoded({
      limit: process.env.APP_FILE_MAX_SIZE,
      extended: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('PROYECT - API')
    .addBearerAuth()
    .setDescription(
      'Basado en principios REST, las API devuelve metadatos JSON.',
    )
    .setVersion('0.0.1')
    .setContact('Ing. Cristian Cueto Vargas', '', 'ccuetovargas65@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Documentación',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
