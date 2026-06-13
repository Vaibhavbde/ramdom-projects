import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, UpdateDateColumn, BeforeInsert, OneToMany } from 'typeorm';

import { UserResponseObject } from './user.dto';
import { TodoEntity } from '../todos/todo.entity';
import { JwtService } from 'src/shared/services/jwt.service';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column({ default: 0 })
  role: number;

  @CreateDateColumn()
  'created_at': Date;

  @UpdateDateColumn()
  'updated_at': Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: false })
  disabled: boolean;

  // Relationships
  @OneToMany(type => TodoEntity, todo => todo.user)
  todos: TodoEntity[];

  // Methods
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  serialize(options: any = { includeToken: false }) {
    const { id, email, role, token, created_at, updated_at } = this;
    const serializedUser: UserResponseObject = { id, email, role, created_at, updated_at };
    if (options.includeToken) { serializedUser.token = token; }
    return serializedUser;
  }

  async comparePassword(given: string) {
    return await bcrypt.compare(given, this.password);
  }

  private get token() {
    const { id, disabled, role } = this;
    return JwtService.sign({ id, disabled, role });
  }
}
