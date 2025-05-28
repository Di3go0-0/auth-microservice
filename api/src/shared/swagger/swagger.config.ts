import { DocumentBuilder, OpenAPIObject } from '@nestjs/swagger';

export class SwaggerConfig {
  static config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Auth MicroService')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http', scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT Authentication',
      description: 'Introduce tu token JWT Bearer',
      in: 'header',
    },
      'Token',
    )
    .build();
}
