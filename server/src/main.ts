import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'colors';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    credentials: true,
    // origin: 'https://conduits.ml',
    origin: process.env.CLIENT_DOMAIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    exposedHeaders: ['set-cookie'],
  });

  app.use(cookieParser());
  const port = process.env.PORT || 5000;
  await app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
    console.log(`🐸 Running on ${process.env.NODE_ENV} mode`);
    console.log(`🍞 Environment Loaded: ${process.env.ENV_FLAG}`);
  });
}
bootstrap();
