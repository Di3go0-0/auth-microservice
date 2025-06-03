import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Email } from './emails.entity';

@Injectable()
export class EmailsService {
  constructor(
    @InjectRepository(Email, 'emailsConn')
    private readonly emailRepo: Repository<Email>,
  ) { }

  async create(email: string): Promise<string> {
    try {
      const ent = this.emailRepo.create({ email });
      const saved = await this.emailRepo.save(ent);
      return saved.id;
    } catch (err) {
      throw new InternalServerErrorException('Error creando email');
    }
  }

  async findByEmail(email: string): Promise<Email> {
    const ent = await this.emailRepo.findOne({ where: { email } });
    if (!ent) throw new NotFoundException('Email no encontrado');
    return ent;
  }

  async emailExist(email: string): Promise<boolean> {
    const exitemail = await this.emailRepo.find({ where: { email } })
    if (exitemail.length == 0) return false
    return true
  }

  async delete(id: string): Promise<void> {
    await this.emailRepo.delete(id);
  }
}
