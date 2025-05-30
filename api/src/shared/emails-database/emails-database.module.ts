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
        host: 'pb1.incus',
        port: 5432,
        database: 'users_emails_db',
        username: cfg.get('EMAILS_DB_USER'),
        password: cfg.get('EMAILS_DB_PASS'),
        entities: [__dirname + '/../emails/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class EmailsDatabaseModule {}
