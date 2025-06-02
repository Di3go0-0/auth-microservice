import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'emailsConn',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('MASTER_DB_HOST'),
        port: parseInt(cfg.get<string>('MASTER_DB_PORT') ?? '5432', 10),
        username: cfg.get('EMAILS_DB_USER'),
        password: cfg.get('EMAILS_DB_PASS'),
        database: 'users_emails_db',
        entities: [__dirname + '/../emails/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class EmailsDatabaseModule { }

