import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'user_map' })
export class UserMap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email_ref', type: 'uuid' })
  emailRef: string;

  @Column({ name: 'password_ref', type: 'uuid' })
  passwordRef: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
