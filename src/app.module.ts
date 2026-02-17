import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CropsModule } from './crops/crops.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ListingsModule } from './listings/listings.module';
import { MessagesModule } from './messages/messages.module';
import { UserModule } from './user/user.module';
import { DealModule } from './deal/deal.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
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
          ssl: {
            rejectUnauthorized: false, 
          },
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProduction,
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
  ],
})
export class AppModule {}