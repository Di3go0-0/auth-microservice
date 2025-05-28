import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ENV } from '../constans';

@Module({
  imports: [
    NestJwtModule.register({
      secret: ENV.CONSTANS.SECRET_KEY,
      signOptions: { expiresIn: '12h' },
    }),
  ],
  providers: [JwtService],
  exports: [JwtService]
})
export class JwtModule { }
