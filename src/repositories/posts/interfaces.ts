export interface User {
  id: bigint;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface CreateParams {
  email: string;
  username: string;
}
