import { Logger } from '../libraries/logger';
import { Jwt } from '../libraries/jwt';

import { Repositories } from '../repositories';

import { Resources } from '../resources';

import { User } from '../domains/user';

import {
  ExchangeParams, ExchangeResult,
  SignInParams,
  SignInVerifyParams,
  SignInVerifyResult,
  SignupParams,
  SignupVerifyParams,
  SignupVerifyResult,
} from './auth/interfaces';
import { UploadParams } from './media/interfaces';
import { ImageTools } from '../libraries/image-tools';

export interface Params {
  logger: Logger;
  repositories: Repositories;
  resources: Resources;
  jwt: Jwt;
  imageTools: ImageTools;
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

export interface Media {
  upload(params: UploadParams): Promise<string>;
}

export interface ServicesType {
  auth: Auth;
  users: Users;
  media: Media;
}
