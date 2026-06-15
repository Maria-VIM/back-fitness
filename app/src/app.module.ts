import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { UsersModule } from './modules/users/users.module';
import { Pool } from 'pg';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './modules/verification/verification.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { APP_GUARD } from '@nestjs/core';
import { RedisModule } from './modules/redis/redis.module';
import { SessionGuard } from './modules/auth/guards/session.guard';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { SharedAuthModule } from './shared/auth/shared-auth.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ExercisesModule,
    UsersModule,
    VerificationModule,
    WorkoutsModule,
    RedisModule,
    AuthModule,
    SharedAuthModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([
      { name: `short`, ttl: seconds(1), limit: 5 },
      { name: `medium`, ttl: seconds(10), limit: 50 },
      { name: `long`, ttl: seconds(1), limit: 300 },
    ]),
    PrometheusModule.register({
      defaultMetrics: { enabled: true },
      path: '/metrics',
    }),
  ],
  providers: [
    {
      provide: 'pool',
      useFactory: () => {
        return new Pool({
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT!,
          user: process.env.POSTGRES_USER,
          database: process.env.POSTGRES_DB,
          password: process.env.POSTGRES_PASSWORD,
        });
      },
    },
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: ['pool'],
})
export class AppModule {}
