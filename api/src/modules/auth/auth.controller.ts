import { Body, Controller, Post, Query } from '@nestjs/common';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { VerifyTokenDto } from './dtos/verify-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() body: RegisterDto) {
    const { email, password } = body
    return this.authService.register({ email, password });
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('verify-token')
  verifyToken(@Query() body: VerifyTokenDto) {
    return this.authService.verifyToken(body.token);
  }

}
