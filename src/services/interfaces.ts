import { Logger } from '../libraries/logger';
import { Jwt } from '../libraries/jwt';

import { Repositories } from '../repositories';

import { Resources } from '../resources';

import { User } from '../domains/user';
import { Image } from '../domains/image';

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
import { UserCreateParams } from './users/interfaces';

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
  getUserByIdWithDeleted(id: bigint): Promise<User>;
}

export interface Users {
  getByEmailOrUsername(
    email: string,
    nickname: string
  ): Promise<User | undefined>;
  create(params: UserCreateParams): Promise<bigint>;
  getByEmail(email: string): Promise<User | undefined>;
  getById(id: bigint): Promise<User | undefined>;
  getByIdWithDeleted(id: bigint): Promise<User | undefined>;
}

export interface Medias {
  upload(params: UploadParams): Promise<string>;
  getImageByIds(ids: Array<string>): Promise<Array<Image>>;
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
