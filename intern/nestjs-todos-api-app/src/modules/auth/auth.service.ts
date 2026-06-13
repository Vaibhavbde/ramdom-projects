import 'dotenv/config';

import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { verify, sign } from 'jsonwebtoken';

import { UserResponseObject } from 'src/modules/users/user.dto';
import { UserEntity } from 'src/modules/users/user.entity';
import { CrudService } from 'src/shared/services/crud.service';

import { AuthDto } from './auth.dto';
import { JwtService } from 'src/shared/services/jwt.service';

@Injectable()
export class AuthService extends CrudService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { super(userRepository); }

  async register(data: AuthDto): Promise<UserResponseObject> {
    const { email } = data;
    let user: UserEntity = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('User with provided email already exists', HttpStatus.BAD_REQUEST);
    }
    user = await this.create(data);
    return user.serialize({ includeToken: true });
  }

  async login(data: AuthDto): Promise<UserResponseObject> {
    const { email, password } = data;
    const user: UserEntity = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid email/password combination', HttpStatus.BAD_REQUEST);
    }
    return user.serialize({ includeToken: true });
  }

  async getFreshAccessToken(token: string) {
    const jwt = token.split(' ')[1];
    try {
      const payload: any = await verify(jwt, process.env.JWT_SECRET, { ignoreExpiration: true });
      const user: UserEntity = await this.userRepository.findOne(payload.id);
        // TODO: Ensure that user.jwt_hash !== hashed version of given jwt (req.headers.auth)
      const { id, disabled, role } = user;
      if (disabled) { throw new Error(); }
        // TODO: Save jwt_hash in db that is hashed version of source jwt (req.headers.auth)
      return {
        token: JwtService.sign({ id, disabled, role }),
      };
    } catch (err) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
