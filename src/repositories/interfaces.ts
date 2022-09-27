import { CreateParams } from './users/interfaces';
import { AuthInfo } from './auth/interfaces';

export interface Users {
  create(params: CreateParams): Promise<bigint>;
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
