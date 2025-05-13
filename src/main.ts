import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {graphqlUploadExpress} from 'graphql-upload';

const PORT = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({maxFieldSize: 1000000, maxFiles: 10}));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
