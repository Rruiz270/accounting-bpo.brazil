import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { BullModule } from '@nestjs/bull';
import * as winston from 'winston';

// Services
import { EncryptionService } from './services/encryption.service';
import { DateService } from './services/date.service';
import { ValidationService } from './services/validation.service';
import { BrazilianDocumentService } from './services/brazilian-document.service';
import { BrazilianBankService } from './services/brazilian-bank.service';
import { CepService } from './services/cep.service';
import { NotificationService } from './services/notification.service';
import { FileService } from './services/file.service';
import { PdfService } from './services/pdf.service';
import { ExcelService } from './services/excel.service';
import { QrCodeService } from './services/qr-code.service';

// Guards
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TenantGuard } from './guards/tenant.guard';
import { RolesGuard } from './guards/roles.guard';

// Interceptors
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TenantInterceptor } from './interceptors/tenant.interceptor';

// Filters
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';

// Pipes
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';
import { TrimStringsPipe } from './pipes/trim-strings.pipe';

// Decorators
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentTenant } from './decorators/current-tenant.decorator';
import { Roles } from './decorators/roles.decorator';
import { Public } from './decorators/public.decorator';

const services = [
  EncryptionService,
  DateService,
  ValidationService,
  BrazilianDocumentService,
  BrazilianBankService,
  CepService,
  NotificationService,
  FileService,
  PdfService,
  ExcelService,
  QrCodeService,
];

const guards = [
  JwtAuthGuard,
  TenantGuard,
  RolesGuard,
];

const interceptors = [
  ResponseInterceptor,
  LoggingInterceptor,
  TenantInterceptor,
];

const filters = [
  AllExceptionsFilter,
  ValidationExceptionFilter,
];

const pipes = [
  ParseObjectIdPipe,
  TrimStringsPipe,
];

@Global()
@Module({
  imports: [
    // Winston Logger
    WinstonModule.forRoot({
      level: process.env.LOG_LEVEL || 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
        winston.format.colorize({ all: true }),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
              return `${timestamp} [${context || 'Application'}] ${level}: ${message} ${
                Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
              }`;
            }),
          ),
        }),
        // Add file transports in production
        ...(process.env.NODE_ENV === 'production' ? [
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({
            filename: 'logs/combined.log',
          }),
        ] : []),
      ],
    }),

    // Bull Queues
    BullModule.registerQueue(
      { name: 'email' },
      { name: 'sms' },
      { name: 'whatsapp' },
      { name: 'bank-sync' },
      { name: 'reconciliation' },
      { name: 'reports' },
      { name: 'dominio-sync' },
      { name: 'file-processing' },
      { name: 'notifications' },
    ),
  ],
  providers: [
    ...services,
    ...guards,
    ...interceptors,
    ...filters,
    ...pipes,
  ],
  exports: [
    ...services,
    WinstonModule,
    BullModule,
  ],
})
export class CommonModule {}