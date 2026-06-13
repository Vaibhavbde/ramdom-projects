import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoEntity } from './todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TodoEntity, UserEntity])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
