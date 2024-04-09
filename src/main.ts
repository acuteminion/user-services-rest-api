import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import AppConfig from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('User service API')
    .setDescription(
      'Register & get user, handle user avatar and sending mails to the new user',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  try {
    await app.listen(AppConfig().PORT);
    console.log(`Server is running on port ${AppConfig().PORT}...`);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
