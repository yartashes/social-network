import { CreateParams } from './users/interfaces';

export interface Users {
  create(params: CreateParams): Promise<bigint>;
}

export interface RepositoriesType {
  users: Users;
}
