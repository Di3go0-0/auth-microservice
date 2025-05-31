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
        host: 'pb1.incus',
        port: 5432,
        database: 'users_passwords_db',
        username: cfg.get<string>('PASSWORDS_DB_USER'),
        password: cfg.get<string>('PASSWORDS_DB_PASS'),
        entities: [__dirname + '/../passwords/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class PasswordsDatabaseModule {}
