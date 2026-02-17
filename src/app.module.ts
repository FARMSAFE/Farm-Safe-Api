// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CropsModule } from './crops/crops.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ListingsModule } from './listings/listings.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';
import { DealModule } from './deal/deal.module';
import { AuthModule } from './auth/auth.module';
import { Session } from './auth/entities/session.entity';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().required(),
        SESSION_SECRET: Joi.string().min(32).required().when('NODE_ENV', {
          is: 'production',
          then: Joi.required(),
          otherwise: Joi.optional().default('dev-session-secret-key-change-this'),
        }),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isProduction = configService.get('NODE_ENV') === 'production';
        const databaseUrl = configService.get('DATABASE_URL');
        
        return {
          type: 'postgres',
          url: databaseUrl,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/**/*.entity{.ts,.js}', Session], // Include Session entity
          synchronize: !isProduction, // Don't use synchronize in production
          logging: !isProduction,
          autoLoadEntities: true,
          extra: {
            max: 20,
            connectionTimeoutMillis: 5000,
          },
        };
      },
    }),
    CropsModule,
    AnalyticsModule,
    ListingsModule,
    MessagesModule,
    UserModule,
    DealModule,
    AuthModule,
  ],
})
export class AppModule {}