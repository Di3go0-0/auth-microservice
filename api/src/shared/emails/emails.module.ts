import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Email } from './emails.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Email], 'emailsConn'),
  ],
  providers: [EmailsService],
  exports: [EmailsService]
})
export class EmailsModule { }
