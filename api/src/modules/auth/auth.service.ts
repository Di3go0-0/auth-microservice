import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
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
  ) { }

  async register(body: RegisterType) {
    const inserted = { emailId: '', passwordId: '', linkId: '' };
    try {
      inserted.emailId = await this.emails.create(body.email);
      inserted.passwordId = await this.passwords.create((body.password));
      inserted.linkId = await this.links.create({
        emailRef: inserted.emailId,
        passwordRef: inserted.passwordId,
      });
      return { userId: inserted.linkId };
    } catch (err) {
      if (inserted.linkId) {
        await this.links.delete(inserted.linkId);
      }
      if (inserted.passwordId) {
        await this.passwords.delete(inserted.passwordId);
      }
      if (inserted.emailId) {
        await this.emails.delete(inserted.emailId);
      }
      throw new InternalServerErrorException('Registro falló');
    }
  }

  async login(body: LoginType) {
    const emailRec = await this.emails.findByEmail(body.email);
    const linkRec = await this.links.findByEmailRef(emailRec.id);
    const passRec = await this.passwords.findById(linkRec.passwordRef);
    if (!await this.passwords.compare(body.password, passRec.hash))
      throw new UnauthorizedException();
    const token = this.jwtService.generateToken({ id: linkRec.id, email: body.email });
    return { token };
  }


  async verifyToken(token: string) {
    const payload = await this.jwtService.verifyToken(token);
    const linkRec = await this.emails.findByEmail(payload.email);
    if (!linkRec) throw new UnauthorizedException('Token inválido');
    return { id: linkRec.id, email: payload.email, rol: 'user' };
  }
}
