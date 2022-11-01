import { Logger } from '../libraries/logger';
import { Jwt } from '../libraries/jwt';

import { Repositories } from '../repositories';

import { Resources } from '../resources';

import { User } from '../domains/user';

import { ImageTools } from '../libraries/image-tools';

import { Requester } from '../requester';

import {
  ExchangeParams, ExchangeResult,
  SignInParams,
  SignInVerifyParams,
  SignInVerifyResult,
  SignupParams,
  SignupVerifyParams,
  SignupVerifyResult,
} from './auth/interfaces';

import { UploadParams } from './medias/interfaces';

import { PostCreateParams } from './posts/interfaces';

export interface Params {
  logger: Logger;
  repositories: Repositories;
  resources: Resources;
  jwt: Jwt;
  imageTools: ImageTools;
  requester: Requester
}

export interface Auth {
  signup(params: SignupParams): Promise<boolean>;
  signupVerify(params: SignupVerifyParams): Promise<SignupVerifyResult>;
  signIn(params: SignInParams): Promise<boolean>;
  signInVerify(params: SignInVerifyParams): Promise<SignInVerifyResult>;
  exchange(params: ExchangeParams): Promise<ExchangeResult>;
  getUserById(id: bigint): Promise<User>;
}

export interface Users {
  getByIdWithDeleted(id: bigint): Promise<User>;
}

export interface Medias {
  upload(params: UploadParams): Promise<string>;
}

export interface Posts {
  create(params: PostCreateParams): Promise<string>;
}

export interface Services {
  auth: Auth;
  users: Users;
  medias: Medias;
  posts: Posts;
}
