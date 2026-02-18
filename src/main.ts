// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMSessionStore } from './auth/session-store';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from './auth/entities/session.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';

  // Get session repository from DI
  const sessionRepository = app.get(getRepositoryToken(Session));
  const sessionStore = new TypeORMSessionStore(sessionRepository);

  // ✅ All middleware must be registered BEFORE app.listen()
  // (removed standalone app.init() — listen() handles initialization internally)

  app.use(
    session({
      name: 'farmsafe.sid',
      secret: configService.get('SESSION_SECRET') || 'dev-session-secret-key-change-this',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
      },
    })
  );

  // ✅ Passport must come AFTER session middleware
  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // ✅ CORS open in development so the HTML tester can connect
  if (!isProduction) {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  const port = configService.get('PORT') || 3000;
  await app.listen(port);

  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();