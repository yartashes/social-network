import { User } from '../../domains/user';

import { BaseService } from '../base';

import { Users } from '../interfaces';
import { UserCreateParams } from './interfaces';
import { ClientError } from '../../libraries/errors/client';
import { HttpStatusCodes } from '../../libraries/constants/http-status-codes';

export class UsersService extends BaseService implements Users {
  public async getByIdWithDeleted(id: bigint): Promise<User> {
    const user = await this.repositories.users.getByIdWithDeleted(id);

    if (!user) {
      throw new Error('Invalid user id');
    }

    return user;
  }

  public async create(params: UserCreateParams): Promise<bigint> {
    const emailExists = await this.repositories
      .users
      .getByEmailWithDeleted(params.email);

    if (emailExists && !emailExists.deletedAt) {
      throw new ClientError(
        'User already exists',
        HttpStatusCodes.badRequest,
      );
    }

    if (emailExists && emailExists.deletedAt) {
      await this.repositories
        .users
        .replaceOldEmail(params.email);
    }

    const nicknameExists = await this.repositories
      .users
      .getByNicknameWithDeleted(params.username);

    if (nicknameExists) {
      throw new ClientError(
        'Nickname already exists',
        HttpStatusCodes.badRequest,
      );
    }

    return this.repositories
      .users
      .create({
        email: params.email,
        username: params.username,
      });
  }

  public async getByEmail(email: string): Promise<User | undefined> {
    return this.repositories.users.getByEmail(email);
  }

  public async getByEmailOrUsername(
    email: string,
    nickname: string,
  ): Promise<User | undefined> {
    return this.repositories.users.getByEmailOrUsername(email, nickname);
  }

  public async getById(id: bigint): Promise<User | undefined> {
    return this.repositories.users.getById(id);
  }
}
