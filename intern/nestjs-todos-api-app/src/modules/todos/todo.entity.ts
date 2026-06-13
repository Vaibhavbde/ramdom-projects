import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { TodoResponseObject } from './todo.dto';

@Entity('todos')
export class TodoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  description: string;

  @Column({ default: false })
  completed: boolean;

  @CreateDateColumn()
  'created_at': Date;

  @UpdateDateColumn()
  'updated_at': Date;

  @Column({ default: false })
  deleted: boolean;

  // Relationships
  @ManyToOne(type => UserEntity, user => user.todos)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  serialize() {
    const { id, description, completed, created_at, updated_at } = this;
    const serializedTodo: TodoResponseObject =  { id, description, completed, created_at, updated_at };
    return serializedTodo;
  }
}
