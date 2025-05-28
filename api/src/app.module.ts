import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { ModulesModule } from './modules/modules.module';
import { EmailsDatabaseModule } from './shared/emails-database/emails-database.module';
import { LinksDatabaseModule } from './shared/links-database/links-database.module';
import { PasswordsDatabaseModule } from './shared/passwords-database/passwords-database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, }),
    SharedModule, ModulesModule,

    EmailsDatabaseModule,
    PasswordsDatabaseModule,
    LinksDatabaseModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
