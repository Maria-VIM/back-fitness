import { Global, Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { UsersModule } from './modules/users/users.module';
import { Pool } from 'pg';
import { ConfigModule } from '@nestjs/config';
import { VerificationModule } from './modules/verification/verification.module';
import { ArticlesModule } from './modules/articles/articles.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ExercisesModule,
    UsersModule,
    VerificationModule,
    ArticlesModule,
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
  ],
  exports: ['pool'],
})
export class AppModule {}
