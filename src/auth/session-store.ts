import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { Store } from 'express-session';

export class TypeORMSessionStore extends Store {
  constructor(private sessionRepository: Repository<Session>) {
    super();
  }

  async get(sid: string, callback: (err: any, session?: any) => void): Promise<void> {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId: sid, isRevoked: false },
      });

      if (!session || new Date() > session.expiresAt) {
        return callback(null, null);
      }

      callback(null, session.data);
    } catch (err) {
      callback(err);
    }
  }

  async set(sid: string, session: any, callback?: (err?: any) => void): Promise<void> {
    try {
      const expiresAt = session.cookie?.expires ||
        new Date(Date.now() + (session.cookie?.maxAge || 24 * 60 * 60 * 1000));

      // Extract userId from passport session data if available
      const userId = session?.passport?.user?.id || null;

      // Check if session already exists
      const existing = await this.sessionRepository.findOne({
        where: { sessionId: sid },
      });

      if (existing) {
        // Update existing session
        await this.sessionRepository.update(
          { sessionId: sid },
          {
            data: session,
            expiresAt,
            // Only update userId if we now have one
            ...(userId ? { userId } : {}),
          }
        );
      } else {
        // Insert new session — userId may be null for anonymous sessions
        // and that's fine, it gets updated on next save after login
        const sessionEntity = this.sessionRepository.create({
          sessionId: sid,
          userId: userId,
          data: session,
          expiresAt,
          isRevoked: false,
        });
        await this.sessionRepository.save(sessionEntity);
      }

      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async destroy(sid: string, callback?: (err?: any) => void): Promise<void> {
    try {
      await this.sessionRepository.delete({ sessionId: sid });
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }

  async touch(sid: string, session: any, callback?: (err?: any) => void): Promise<void> {
    try {
      const expiresAt = session.cookie?.expires ||
        new Date(Date.now() + (session.cookie?.maxAge || 24 * 60 * 60 * 1000));

      await this.sessionRepository.update(
        { sessionId: sid },
        { expiresAt, data: session }
      );
      callback?.();
    } catch (err) {
      callback?.(err);
    }
  }
}