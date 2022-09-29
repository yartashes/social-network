import { Logger } from '../libraries/logger';
import { Repositories } from '../repositories';
import { Resources } from '../resources';
import { Jwt } from '../libraries/jwt';

import {
  ExchangeParams, ExchangeResult,
  SignInParams,
  SignInVerifyParams,
  SignInVerifyResult,
  SignupParams,
  SignupVerifyParams,
  SignupVerifyResult,
} from './auth/interfaces';
import { User } from '../domains/user';

export interface Params {
  logger: Logger;
  repositories: Repositories;
  resources: Resources;
  jwt: Jwt;
}

export interface Auth {
  signup(params: SignupParams): Promise<boolean>;
  signupVerify(params: SignupVerifyParams): Promise<SignupVerifyResult>;
  signIn(params: SignInParams): Promise<boolean>;
  signInVerify(params: SignInVerifyParams): Promise<SignInVerifyResult>;
  exchange(params: ExchangeParams): Promise<ExchangeResult>;
}

export interface Users {
  getByIdWithDeleted(id: bigint): Promise<User>;
}

export interface ServicesType {
  auth: Auth;
  users: Users;
}
