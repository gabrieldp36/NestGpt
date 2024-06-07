import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

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

  // Puerto
  await app.listen(3000);
}
bootstrap();
