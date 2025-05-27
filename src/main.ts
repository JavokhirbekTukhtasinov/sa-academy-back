import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import {graphqlUploadExpress} from 'graphql-upload';
import * as cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 8080;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    // origin: "*",
    origin: (origin, callback) => {
      console.log({origin})
      callback(null, true);
      // const allowedOrigins = [
      //   "https://sparkling-curiosity-production.up.railway.app",
      //   "https://api.ustozhub.com",
      //   'http://localhost:3000',
      //   "http://localhost:3001",
      //    "electron://altair",
      //     'http://localhost:8080',
      //      'https://ustozhub.com',
      //       "http://172.30.1.26:3000", 
      //      "http://172.30.1.26:8080",];
      
      // if (!origin || allowedOrigins.includes(origin)) {
      //   callback(null, true);
      // } else {
      //   callback(new Error('Not allowed by CORS'));
      // }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
  app.useGlobalPipes(new ValidationPipe());
  app.use(graphqlUploadExpress({maxFieldSize: 1000000, maxFiles: 10}));
  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

bootstrap();
