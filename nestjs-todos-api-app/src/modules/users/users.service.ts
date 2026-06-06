import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { CrudService } from 'src/shared/services/crud.service';

import { UserEntity } from './user.entity';

@Injectable()
export class UsersService extends CrudService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }
}
