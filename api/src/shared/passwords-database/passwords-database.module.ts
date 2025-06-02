import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'passwordsConn',
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        host: cfg.get<string>('MASTER_DB_HOST'),
        port: parseInt(cfg.get<string>('MASTER_DB_PORT') ?? '5432', 10),
        username: cfg.get<string>('PASSWORDS_DB_USER'),
        password: cfg.get<string>('PASSWORDS_DB_PASS'),
        database: 'users_passwords_db',
        entities: [__dirname + '/../passwords/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PasswordsDatabaseModule { }
