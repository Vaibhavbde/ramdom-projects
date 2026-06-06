import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, HttpCode, UseGuards } from '@nestjs/common';

import { BaseValidationPipe } from 'src/shared/pipes/base-validation.pipe';

import { AuthGuard } from 'src/shared/guards/auth.guard';
import { TodosService } from './todos.service';
import { TodoCreateDto, TodoUpdateDto, TodoResponseObject } from './todo.dto';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { TodosPolicy } from './todos.policy';
import { User } from 'src/shared/decorators/user.decorator';
import { UserEntity } from '../users/user.entity';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('todos')
@ApiUseTags('todos') @ApiBearerAuth()
@UseGuards(new AuthGuard(), new RolesGuard(new TodosPolicy()))
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
  ) { }

  @Get()
  index(@User() user: UserEntity): Promise<TodoResponseObject[]> {
    return this.todosService.getAll(user);
  }

  @Get(':id')
  show(@Param('id') id: number, @User() user: UserEntity): Promise<TodoResponseObject> {
    return this.todosService.getOne(id, user);
  }

  @Post()
  @UsePipes(new BaseValidationPipe())
  create(@User('id') userId: number, @Body() data: TodoCreateDto): Promise<TodoResponseObject> {
    return this.todosService.create(data, userId);
  }

  @Put(':id')
  @UsePipes(new BaseValidationPipe())
  update(@Param('id') id: number, @Body() data: TodoUpdateDto, @User() user: UserEntity): Promise<TodoResponseObject> {
    return this.todosService.update(id, data, user);
  }

  @Delete(':id')
  @HttpCode(204)
  destroy(@Param('id') id: number, @User() user: UserEntity): Promise<void> {
    return this.todosService.softDelete(id, user);
  }
}
