import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { User } from '../../../../domains/user';

import { LocalBaseHandler } from '../base';

import {
  CreateRequest,
  GetByEmailOrUsernameRequest,
} from './interfaces';
import { signupVerifyRequest } from '../../../http/handlers/auth/constants';

export class UsersHandler extends LocalBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.users;
  }

  public async getByEmailOrUsername(
    request: GetByEmailOrUsernameRequest,
  ): Promise<User | undefined> {
    return this.services
      .users
      .getByEmailOrUsername(
        request.email,
        request.username,
      );
  }

  public async create(
    request: CreateRequest,
  ): Promise<bigint> {
    return this.services
      .users
      .create({
        email: request.email,
        username: request.username,
      });
  }

  public async getByEmail(request: string): Promise<User | undefined> {
    return this.services
      .users
      .getByEmail(request);
  }

  public async getById(request: bigint): Promise<User | undefined> {
    return this.services
      .users
      .getById(request);
  }

  public async getByIdWithDeleted(
    request: bigint,
  ): Promise<User | undefined> {
    return this.services
      .users
      .getByIdWithDeleted(request);
  }
}
