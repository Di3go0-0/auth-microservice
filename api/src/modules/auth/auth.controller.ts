import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post()
  register(@Body() body: RegisterDto) {
    const { email, password } = body
    return this.authService.register({ email, password });
  }

}
