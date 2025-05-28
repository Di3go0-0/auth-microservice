import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMap } from './links.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(UserMap, 'linksConn')
    private readonly mapRepo: Repository<UserMap>,
  ) { }

  async create(ref: { emailRef: string; passwordRef: string }): Promise<string> {
    try {
      const ent = this.mapRepo.create(ref);
      const saved = await this.mapRepo.save(ent);
      return saved.id;
    } catch (err) {
      throw new InternalServerErrorException('Error creando enlace');
    }
  }

  async findByEmailRef(emailRef: string): Promise<UserMap> {
    const ent = await this.mapRepo.findOne({ where: { emailRef } });
    if (!ent) throw new NotFoundException('Enlace no encontrado para email');
    return ent;
  }

  async findByPasswordRef(passwordRef: string): Promise<UserMap> {
    const ent = await this.mapRepo.findOne({ where: { passwordRef } });
    if (!ent) throw new NotFoundException('Enlace no encontrado para contraseña');
    return ent;
  }

  async delete(userId: string): Promise<void> {
    await this.mapRepo.delete(userId);
  }
}
