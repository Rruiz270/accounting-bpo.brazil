import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    PrismaService,
    DatabaseService,
    {
      provide: 'DATABASE_CONFIG',
      useFactory: (configService: ConfigService) => ({
        url: configService.get<string>('database.url'),
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        name: configService.get<string>('database.name'),
        ssl: configService.get<boolean>('database.ssl'),
      }),
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService, DatabaseService, 'DATABASE_CONFIG'],
})
export class DatabaseModule {}