import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RedisService } from './modules/redis/redis.service';
import { RedisStore } from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
    origin: process.env.NODE_ENV !== 'production' ? true : process.env.ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  const redisService: RedisService = app.get(RedisService);
  const redisStore: RedisStore = redisService.getStore();
  app.use(
    session({
      store: redisStore,
      secret: configService.get('SECRET') || 'oops I did it again',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 180 * 60,
      },
      rolling: true,
    }),
  );
  const config = new DocumentBuilder().setTitle('Wellness Fitness').setVersion('1.0').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const port: number = +process.env.SVC_PORT! || 8080;
  const hostname: string = process.env.SVC_HOSTNAME || '0.0.0.0';
  await app.listen(port, hostname);
}
void bootstrap();
