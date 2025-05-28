import { Module } from '@nestjs/common';
import { PasswordsService } from './passwords.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Password } from './passwords.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Password], 'passwordsConn'),
  ],
  providers: [PasswordsService],
  exports: [PasswordsService]
})
export class PasswordsModule { }
