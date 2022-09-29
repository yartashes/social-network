import { User } from '../../domains/user';

import { BaseService } from '../base';

import { Users } from '../interfaces';

export class UsersService extends BaseService implements Users {
  public async getByIdWithDeleted(id: bigint): Promise<User> {
    const user = await this.repositories.users.getByIdWithDeleted(id);

    if (!user) {
      throw new Error('Invalid user id');
    }

    return user;
  }
}
