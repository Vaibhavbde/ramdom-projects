import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';

import { UsersService } from './users.service';
import { UserResponseObject } from './user.dto';
import { UsersPolicy } from './users.policy';
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiUseTags('users') @ApiBearerAuth()
@UseGuards(new AuthGuard(), new RolesGuard(new UsersPolicy()))
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async index(): Promise<UserResponseObject[]> {
    return await this.usersService.getAll();
  }
}
