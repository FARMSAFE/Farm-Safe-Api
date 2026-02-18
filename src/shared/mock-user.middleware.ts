/**
 * STUB middleware - simulates Passport session auth.
 * Injects req.user and req.isAuthenticated() so your controllers work.
 * 
 * DELETE this file when Auth module is merged.
 */
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class MockUserMiddleware implements NestMiddleware {
  use(req: any, _res: any, next: () => void) {
    // Simulate a logged-in farmer (change role to test as buyer/admin)
    if (!req.user) {
      req.user = {
        id: 'test-farmer-001',
        email: 'farmer@farmsafe.mw',
        firstName: 'Test',
        lastName: 'Farmer',
        role: 'farmer',
        phoneNumber: '+265999000001',
        district: 'Lilongwe',
      };
    }

    // Simulate Passport's isAuthenticated() method
    req.isAuthenticated = () => true;
    
    // Simulate session
    req.sessionID = 'mock-session-id';
    req.session = { 
      passport: { user: req.user.id }
    };

    next();
  }
}
