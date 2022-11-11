import { User } from '../domains/user';
import { Image } from '../domains/image';

import { UserCreateParams } from './users/interfaces';
import { AuthInfo } from './auth/interfaces';
import { ImageCreateParams } from './images/interfaces';
import { PostCreateParams } from './posts/interfaces';

export interface Users {
  create(params: UserCreateParams): Promise<bigint>;
  getByEmail(email: string): Promise<User | undefined>;
  getByIdWithDeleted(id: bigint): Promise<User | undefined>;
  getById(id: bigint): Promise<User | undefined>;
  getByEmailWithDeleted(
    email: string,
  ): Promise<User | undefined>;
  getByNicknameWithDeleted(
    nickname: string,
  ): Promise<User | undefined>;
  getByEmailOrUsername(
    email: string,
    nickname: string,
  ): Promise<User | undefined>;
  replaceOldEmail(email: string): Promise<boolean>;
}

export interface Auth {
  setCode(code: number, info: AuthInfo): Promise<boolean>;
  getCode(code: number): Promise<AuthInfo | undefined>;
  addRefreshToken(userId: bigint, token: string): Promise<boolean>;
  checkRefreshToken(token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<boolean>;
}

export interface Images {
  create(params: ImageCreateParams): Promise<string>;
  getByIds(ids: Array<string>): Promise<Array<Image>>;
}

export interface Posts {
  create(params: PostCreateParams): Promise<string>;
}

export interface RepositoriesType {
  users: Users;
  auth: Auth;
  images: Images;
  posts: Posts;
}
