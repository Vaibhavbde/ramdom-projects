import { UserResponseObject } from 'src/modules/users/user.dto';
import { BasePolicy } from 'src/shared/classes/base.policy';
import { UserEntity } from '../users/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

export class TodosPolicy extends BasePolicy {
  authorize(user: UserEntity, resource: any): void {
    if (user.id !== resource.uesr_id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  all(user?: UserResponseObject): boolean {
    return true;
  }
}
