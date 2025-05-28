import { Injectable } from '@nestjs/common';
import { RegisterType } from './types/register.type';

@Injectable()
export class AuthService {

  async register(body: RegisterType) {
    return body;
  }
}
