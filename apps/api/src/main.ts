import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3333);
  const environment = configService.get<string>('NODE_ENV', 'development');

  // Security
  app.use(helmet({
    contentSecurityPolicy: environment === 'production' ? undefined : false,
  }));
  
  // Compression
  app.use(compression());

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://*.vercel.app',
      'https://*.railway.app',
      /^https:\/\/.*\.seubpo\.com\.br$/,
    ],
    credentials: true,
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ResponseInterceptor(),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global prefix
  app.setGlobalPrefix('api', { exclude: ['/health', '/'] });

  // Swagger documentation
  if (environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('BPO Financeiro API')
      .setDescription('Sistema completo de BPO financeiro para o mercado brasileiro')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addTag('Authentication', 'Endpoints de autenticação e autorização')
      .addTag('Tenants', 'Gestão de empresas clientes')
      .addTag('Users', 'Gestão de usuários')
      .addTag('Suppliers', 'Gestão de fornecedores')
      .addTag('Customers', 'Gestão de clientes')
      .addTag('Accounts Payable', 'Contas a pagar')
      .addTag('Accounts Receivable', 'Contas a receber')
      .addTag('Treasury', 'Tesouraria e fluxo de caixa')
      .addTag('Bank Integration', 'Integração bancária')
      .addTag('Reconciliation', 'Conciliação bancária')
      .addTag('Reports', 'Relatórios e dashboards')
      .addTag('Notifications', 'Sistema de notificações')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment,
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  await app.listen(port);
  
  console.log(`🚀 BPO Financeiro API running on: ${await app.getUrl()}`);
  console.log(`📚 Swagger docs available at: ${await app.getUrl()}/api/docs`);
  console.log(`🏥 Health check available at: ${await app.getUrl()}/health`);
}

bootstrap().catch((error) => {
  console.error('❌ Error starting application:', error);
  process.exit(1);
});