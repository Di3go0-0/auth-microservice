import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from 'src/shared/jwt/jwt.module';
import { EmailsModule } from 'src/shared/emails/emails.module';
import { PasswordsModule } from 'src/shared/passwords/passwords.module';
import { LinksModule } from 'src/shared/links/links.module';

@Module({
  imports: [
    JwtModule,

    EmailsModule,
    PasswordsModule,
    LinksModule,
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
