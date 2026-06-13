import { BasePolicy } from 'src/shared/classes/base.policy';

export class UsersPolicy extends BasePolicy {
  all(user?: any): boolean {
    return this.isAdmin(user) || this.isSuperAdmin(user);
  }
}
