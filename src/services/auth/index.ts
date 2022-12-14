import { TokenExpiredError } from 'jsonwebtoken';

import { ClientError } from '../../libraries/errors/client';

import { HttpStatusCodes } from '../../libraries/constants/http-status-codes';
import { ServiceTypes } from '../../libraries/constants/service-types';

import { TokenType } from '../../libraries/jwt/interfaces';

import { User } from '../../domains/user';

import { BaseService } from '../base';

import { Auth } from '../interfaces';

import {
  ExchangeParams,
  ExchangeResult,
  GetUserByEmailOrUsernameRequest,
  SignInParams,
  SignupParams,
  SignupVerifyParams,
  SignupVerifyResult,
  UserCreateRequest,
} from './interfaces';

export class AuthService extends BaseService implements Auth {
  public async signup(params: SignupParams): Promise<boolean> {
    const code = this.generateCode();

    const userExists = await this.requester
      .call<GetUserByEmailOrUsernameRequest, User | undefined>(
        ServiceTypes.users,
        'getByEmailOrUsername',
        {
          email: params.email,
          username: params.username,
        },
      );

    if (userExists) {
      throw new ClientError(
        'Username or email exist in system',
        HttpStatusCodes.badRequest,
      );
    }

    const codeSetResult = await this.repositories.auth.setCode(
      code,
      {
        email: params.email,
        name: params.username,
      },
    );
    this.log.debug({ codeSetResult }, 'signup add code to storage');
    await this.resources.mail.signup(params.email, code);

    return true;
  }

  public async signupVerify(params: SignupVerifyParams): Promise<SignupVerifyResult> {
    const info = await this.repositories.auth.getCode(params.code);

    if (!info) {
      throw new ClientError('Invalid verification code', HttpStatusCodes.badRequest);
    }

    const userId = await this.requester
      .call<UserCreateRequest, bigint>(
        ServiceTypes.users,
        'create',
        {
          email: info.email,
          username: info.name as string,
        },
      );

    const tokens = await this.jwt.encode(userId);

    await this.repositories.auth.addRefreshToken(userId, tokens.refresh);

    return {
      refresh: tokens.refresh,
      access: tokens.access,
    };
  }

  public async signIn(params: SignInParams): Promise<boolean> {
    const user = await this.requester
      .call<string, User | undefined>(
        ServiceTypes.users,
        'getByEmail',
        params.email,
      );

    if (!user) {
      throw new ClientError('Invalid user email', HttpStatusCodes.badRequest);
    }

    const code = this.generateCode();

    const codeSetResult = await this.repositories.auth.setCode(
      code,
      {
        email: params.email,
      },
    );
    this.log.debug({ codeSetResult }, 'sign in add code to storage');
    await this.resources.mail.signIn(params.email, code);

    return true;
  }

  public async signInVerify(params: SignupVerifyParams): Promise<SignupVerifyResult> {
    const info = await this.repositories.auth.getCode(params.code);

    if (!info) {
      throw new ClientError('Invalid verification code', HttpStatusCodes.badRequest);
    }

    const user = await this.requester
      .call<string, User | undefined>(
        ServiceTypes.users,
        'getByEmail',
        info.email,
      );

    if (!user) {
      throw new ClientError('Invalid user information', HttpStatusCodes.badRequest);
    }

    const tokens = await this.jwt.encode(user.id as bigint);

    await this.repositories.auth.addRefreshToken(user.id as bigint, tokens.refresh);

    return {
      refresh: tokens.refresh,
      access: tokens.access,
    };
  }

  public async exchange(params: ExchangeParams): Promise<ExchangeResult> {
    try {
      const payload = await this.jwt.decode(params.token);

      if (payload.type !== TokenType.refresh) {
        throw new ClientError(
          'Incorrect Jwt type',
          HttpStatusCodes.forbidden,
        );
      }

      const exists = await this.repositories
        .auth
        .checkRefreshToken(params.token);

      if (!exists) {
        throw new ClientError('Invalid jwt token', HttpStatusCodes.forbidden);
      }

      const user = await this.requester
        .call<bigint, User | undefined>(
          ServiceTypes.users,
          'getById',
          payload.id,
        );

      if (!user) {
        throw new ClientError('Invalid user information', HttpStatusCodes.badRequest);
      }

      const tokens = await this.jwt.encode(user.id as bigint);

      await this.repositories.auth.addRefreshToken(user.id as bigint, tokens.refresh);

      return {
        refresh: tokens.refresh,
        access: tokens.access,
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new ClientError(
          'Jwt token expired',
          HttpStatusCodes.unauthorized,
        );
      }
    }

    return {
      refresh: '',
      access: '',
    };
  }

  public async getUserByIdWithDeleted(id: bigint): Promise<User> {
    return this.requester.call<bigint, User>(
      ServiceTypes.users,
      'getByIdWithDeleted',
      id,
    );
  }

  private generateCode(): number {
    return Math.floor(
      10000 + (Math.random() * 900000),
    );
  }
}
