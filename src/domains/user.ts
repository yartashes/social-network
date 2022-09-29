export interface User {
  id?: bigint;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
