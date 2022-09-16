export interface Mail {
  signup(email: string, code: number): Promise<unknown>;
}

export interface SenderInfo {
  Email: string;
  Name: string;
}
