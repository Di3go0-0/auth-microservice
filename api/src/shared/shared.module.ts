import { Module } from '@nestjs/common';
import { EmailsDatabaseModule } from './emails-database/emails-database.module';
import { PasswordsDatabaseModule } from './passwords-database/passwords-database.module';
import { LinksDatabaseModule } from './links-database/links-database.module';
import { EmailsModule } from './emails/emails.module';
import { PasswordsModule } from './passwords/passwords.module';
import { LinksModule } from './links/links.module';
import { JwtModule } from './jwt/jwt.module';

@Module({
  imports: [EmailsDatabaseModule, PasswordsDatabaseModule, LinksDatabaseModule, EmailsModule, PasswordsModule, LinksModule, JwtModule]
})
export class SharedModule { }
