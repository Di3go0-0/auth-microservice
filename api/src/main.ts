import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from './shared/constans';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { SwaggerConfig } from './shared/swagger/swagger.config';


async function bootstrap() {
  const rute = process.env.SWAGGER_RUTE || ENV.CONSTANS.SWAGGER_RUTE;
  const port = process.env.API_PORT || ENV.CONSTANS.API_PORT;
  const front = process.env.APP || ENV.CONSTANS.APP;

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  )

  SwaggerModule.setup(
    rute,
    app,
    SwaggerModule.createDocument(app, SwaggerConfig.config, {
      deepScanRoutes: true,
    }),
  )
  console.log(`Swagger running on: localhost:${port}/${rute}`);
  app.enableCors({
    origin: front,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(port, '0.0.0.0');
}
bootstrap();
