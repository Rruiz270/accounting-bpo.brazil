import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('database.url'),
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'pretty',
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });

    this.$on('warn', (e) => {
      this.logger.warn('Database warning:', e);
    });

    this.$on('info', (e) => {
      this.logger.log('Database info:', e);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Database disconnected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to disconnect from database:', error);
    }
  }

  /**
   * Execute transaction with tenant isolation
   */
  async executeWithTenant<T>(tenantId: string, fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return this.$transaction(async (prisma) => {
      // Set tenant context for RLS
      await prisma.$executeRaw`SELECT set_config('app.current_tenant', ${tenantId}, true)`;
      return fn(prisma);
    });
  }

  /**
   * Clean shutdown
   */
  async enableShutdownHooks(app: any) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Health check
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get database version
   */
  async getVersion(): Promise<string> {
    try {
      const result = await this.$queryRaw<[{ version: string }]>`SELECT version()`;
      return result[0]?.version || 'Unknown';
    } catch {
      return 'Unknown';
    }
  }

  /**
   * Get connection info
   */
  async getConnectionInfo() {
    try {
      const [
        version,
        currentDatabase,
        currentUser,
        connectionCount,
      ] = await Promise.all([
        this.getVersion(),
        this.$queryRaw<[{ current_database: string }]>`SELECT current_database()`,
        this.$queryRaw<[{ current_user: string }]>`SELECT current_user`,
        this.$queryRaw<[{ count: bigint }]>`SELECT count(*) FROM pg_stat_activity`,
      ]);

      return {
        version: version,
        database: currentDatabase[0]?.current_database || 'Unknown',
        user: currentUser[0]?.current_user || 'Unknown',
        activeConnections: Number(connectionCount[0]?.count || 0),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Failed to get connection info:', error);
      return {
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}