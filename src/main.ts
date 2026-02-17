// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session'; 
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TypeORMSessionStore } from './auth/session-store';
import { getRepositoryToken } from '@nestjs/typeorm'; // Import this
import { Session } from './auth/entities/session.entity'; // Import the entity

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  // Wait for the app to initialize
  await app.init();
  
  // Get session repository using NestJS's DI instead of getRepository
  const sessionRepository = app.get(getRepositoryToken(Session));
  
  // Create custom session store
  const sessionStore = new TypeORMSessionStore(sessionRepository);
  
  app.use(
    session({
      name: 'farmsafe.sid',
      secret: configService.get('SESSION_SECRET') || 'your-secret-key-change-this',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
      },
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  
  if (!isProduction) {
    app.enableCors({
      origin: 'http://localhost:3001',
      credentials: true,
    });
  }
  
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`Application running on: http://localhost:${port}`);
  console.log(`Environment: ${configService.get('NODE_ENV')}`);
}
bootstrap();