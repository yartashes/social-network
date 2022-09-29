import { CreateParams } from './users/interfaces';
import { AuthInfo } from './auth/interfaces';
import { User } from '../domains/user';

export interface Users {
  create(params: CreateParams): Promise<bigint>;
  getByEmail(email: string): Promise<User | undefined>;
  getByIdWithDeleted(id: bigint): Promise<User | undefined>;
  getById(id: bigint): Promise<User | undefined>;
}

export interface Auth {
  setCode(code: number, info: AuthInfo): Promise<boolean>;
  getCode(code: number): Promise<AuthInfo | undefined>;
  addRefreshToken(userId: bigint, token: string): Promise<boolean>;
  checkRefreshToken(token: string): Promise<boolean>;
  deleteRefreshToken(token: string): Promise<boolean>;
}

export interface RepositoriesType {
  users: Users;
  auth: Auth;
}
