import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

// Core modules
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TenantsModule } from './modules/tenants/tenants.module';

// Financial modules
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { CustomersModule } from './modules/customers/customers.module';
import { AccountsPayableModule } from './modules/accounts-payable/accounts-payable.module';
import { AccountsReceivableModule } from './modules/accounts-receivable/accounts-receivable.module';
import { TreasuryModule } from './modules/treasury/treasury.module';
import { BankIntegrationModule } from './modules/bank-integration/bank-integration.module';
import { ReconciliationModule } from './modules/reconciliation/reconciliation.module';

// Supporting modules
import { NotificationsModule } from './modules/notifications/notifications.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { FileUploadModule } from './modules/file-upload/file-upload.module';
import { DominioIntegrationModule } from './modules/dominio-integration/dominio-integration.module';

// Common modules
import { CommonModule } from './common/common.module';
import { HealthModule } from './modules/health/health.module';

// Configuration
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Queue system
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // GraphQL
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      context: ({ req, res, connection }) => {
        if (connection) {
          return { req: connection.context, res };
        }
        return { req, res };
      },
      formatError: (error) => {
        console.error('GraphQL Error:', error);
        return {
          message: error.message,
          code: error.extensions?.code,
          timestamp: new Date().toISOString(),
        };
      },
    }),

    // Core modules
    CommonModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    HealthModule,

    // Financial modules
    SuppliersModule,
    CustomersModule,
    AccountsPayableModule,
    AccountsReceivableModule,
    TreasuryModule,
    BankIntegrationModule,
    ReconciliationModule,

    // Supporting modules
    NotificationsModule,
    ReportsModule,
    AuditModule,
    FileUploadModule,
    DominioIntegrationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}