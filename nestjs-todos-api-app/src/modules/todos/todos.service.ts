import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { TodoEntity } from './todo.entity';
import { UserEntity } from '../users/user.entity';
import { TodosPolicy } from './todos.policy';
import { BaseService } from 'src/shared/services/base.service';

@Injectable()
export class TodosService extends BaseService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super();
    this.policy = new TodosPolicy();
  }

  private policy: any;

  async getAll(user: UserEntity): Promise<any[]> {
    const collection = await this.todoRepository.find({ where: { deleted: false, user }});
    return collection.map(entity => this.getSerializedEntity(entity));
  }

  async create(data: any, userId: number): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const item = await this.todoRepository.create({ ...data, user });
    await this.todoRepository.save(item);
    return this.getSerializedEntity(item);
  }

  async getOne(id: number, user: UserEntity): Promise<any> {
    return await this.todoRepository.findOneOrFail({ where: { id, deleted: false, user } });
  }

  async update(id: number, data: any, user: UserEntity): Promise<any> {
    await this.todoRepository.findOneOrFail({ where: { id, deleted: false, user } });
    await this.todoRepository.update(id, data);
    return await this.todoRepository.findOne(id);
  }

  async softDelete(id: number, user: UserEntity): Promise<null> {
    await this.todoRepository.findOneOrFail({ where: { id, deleted: false, user } });
    await this.todoRepository.update(id, { deleted: true });
    return;
  }
}
