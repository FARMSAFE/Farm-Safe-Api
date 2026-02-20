import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TypeORMSessionStore } from './auth/session-store';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './auth/entities/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);

  const isProduction = configService.get('NODE_ENV') === 'production';

  const sessionSecret = configService.get<string>('SESSION_SECRET');
  if (!sessionSecret) {
    throw new Error('SESSION_SECRET must be defined in environment variables');
  }


  const expressApp = app.getHttpAdapter().getInstance();
  if (isProduction) {
    expressApp.set('trust proxy', 1);
  }

  // Get frontend URLs from ENV (comma-separated)
  const frontendUrls =
    configService.get<string>('FRONTEND_URL')?.split(',') || [];

  // Session repository
  const sessionRepository = app.get(getRepositoryToken(Session));
  const sessionStore = new TypeORMSessionStore(sessionRepository);

  
  app.use(
    session({
      name: 'farmsafe.sid',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: isProduction, // required for sameSite: 'none'
        sameSite: isProduction ? 'none' : 'lax',
      },
    }),
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: isProduction,
    }),
  );

  
  app.enableCors({
    origin: isProduction
      ? frontendUrls
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.enableShutdownHooks();

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  logger.log(`Application running on port: ${port}`);
  logger.log(`Environment: ${configService.get('NODE_ENV')}`);
  logger.log(`CORS enabled for: ${frontendUrls.join(', ')}`);
}

bootstrap();