import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración necesaria para las validaciones de los Dtos.
  app.useGlobalPipes(
    new ValidationPipe({ // El validation pipe se encarga de validar cada uno de nuestros endpoints.
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Configuración de las Cors.
  app.enableCors();

  // Parseo del body.
  app.use( bodyParser.json({limit: '10mb'}) );
  app.use( bodyParser.urlencoded({limit: '10mb', extended: true}) );

  // Puerto
  await app.listen(3000);
}
bootstrap();
