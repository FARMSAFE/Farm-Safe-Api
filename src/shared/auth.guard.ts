/**
 * STUB guards compatible with session-based auth.
 * Replace with real guards from auth module when merging.
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Stub - allows all requests through.
 * Real version: checks req.isAuthenticated() from passport session
 */
@Injectable()
export class AuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // STUB: Allow all requests
    // REAL: return context.switchToHttp().getRequest().isAuthenticated();
    return true;
  }
}

/**
 * Stub - allows all requests through.
 * Real version: checks user roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // STUB: Allow all requests
    return true;
  }
}

// Role decorator
import { SetMetadata } from '@nestjs/common';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
