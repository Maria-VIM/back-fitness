import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { RedisStore } from 'connect-redis';
import { Session } from 'express-session';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  public client!: RedisClientType;
  public redisStore!: RedisStore;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.client = createClient({
        url: this.configService.get<string>('REDIS') ?? 'redis://redis:6379',

        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              console.error('Max Redis reconnection attempts reached');
              return new Error('Max retries reached');
            }
            return Math.min(retries * 100, 3000);
          },
        },
      });

      await this.client.connect();

      this.redisStore = new RedisStore({
        client: this.client,
        prefix: 'session:',
      });

      console.log('Redis service initialized successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to initialize Redis:', error.message);
      } else {
        console.error('Unknown Redis init error:', error);
      }

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client?.isOpen) {
      await this.client.quit();
      console.log('Redis connection closed');
    }
  }

  async findSessionByUserId(userId: number): Promise<Session | null> {
    const sessionKey = `session:user:${userId}`;
    const sessionData: string | null = await this.client.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData) as Session;
  }

  async destroySession(sessionId: string): Promise<void> {
    await this.client.del(sessionId);
  }

  getStore(): RedisStore {
    return this.redisStore;
  }
}
