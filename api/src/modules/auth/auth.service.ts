import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterType } from './types/register.type';
import { EmailsService } from 'src/shared/emails/emails.service';
import { LinksService } from 'src/shared/links/links.service';
import { PasswordsService } from 'src/shared/passwords/passwords.service';
import { LoginType } from './types/login.type';
import { JwtService } from 'src/shared/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly emails: EmailsService,
    private readonly passwords: PasswordsService,
    private readonly links: LinksService,
    private readonly jwtService: JwtService,
  ) {}

  async register(body: RegisterType) {
    const inserted = { emailId: '', passwordId: '', linkId: '' };
    const existingEmail = await this.emails.findByEmail(body.email);
    if (existingEmail) {
      throw new HttpException({ message: `${body.email} already used` }, 400);
    }

    try {
      inserted.emailId = await this.emails.create(body.email);
      try {
        inserted.passwordId = await this.passwords.create(body.password);
      } catch {
        if (inserted.emailId) {
          await this.emails.delete(inserted.emailId);
        }
        throw new InternalServerErrorException('Registro falló');
      }
      try {
        inserted.linkId = await this.links.create({
          emailRef: inserted.emailId,
          passwordRef: inserted.passwordId,
        });
      } catch {
        if (inserted.passwordId) {
          await this.passwords.delete(inserted.passwordId);
        }
        if (inserted.emailId) {
          await this.emails.delete(inserted.emailId);
        }
        throw new InternalServerErrorException('Registro falló');
      }
      return { userId: inserted.linkId };
    } catch (err) {
      if (err instanceof HttpException) {
        throw new InternalServerErrorException('Registro falló');
      }
      throw err;
    }
  }

  async login(body: LoginType) {
    const emailRec = await this.emails.findByEmail(body.email);
    const linkRec = await this.links.findByEmailRef(emailRec.id);
    const passRec = await this.passwords.findById(linkRec.passwordRef);
    if (!(await this.passwords.compare(body.password, passRec.hash)))
      throw new UnauthorizedException();
    const token = this.jwtService.generateToken({
      id: linkRec.id,
      email: body.email,
    });
    return { token };
  }

  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyToken(token);
    const linkRec = await this.emails.findByEmail(payload.email);
    if (!linkRec) throw new UnauthorizedException('Token inválido');
    return { id: linkRec.id, email: payload.email, rol: 'user' };
  }
}
