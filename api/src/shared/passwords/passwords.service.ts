import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Password } from './passwords.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordsService {
  constructor(
    @InjectRepository(Password, 'passwordsConn')
    private readonly passRepo: Repository<Password>,
  ) { }

  async create(raw: string): Promise<string> {
    const hash = await bcrypt.hash(raw, 10);
    try {
      const ent = this.passRepo.create({ hash });
      const saved = await this.passRepo.save(ent);
      return saved.id;
    } catch (err) {
      throw new InternalServerErrorException('Error creando contraseña');
    }
  }

  async findById(id: string): Promise<Password> {
    const ent = await this.passRepo.findOne({ where: { id } });
    if (!ent) throw new NotFoundException('Contraseña no encontrada');
    return ent;
  }

  async compare(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }

  async delete(id: string): Promise<void> {
    await this.passRepo.delete(id);
  }

}
