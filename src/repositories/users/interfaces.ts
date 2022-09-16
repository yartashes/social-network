export interface User {
  id: bigint;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface CreateParams {
  email: string;
  username: string;
}
