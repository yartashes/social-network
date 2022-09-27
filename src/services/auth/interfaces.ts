export interface SignupParams {
  email: string;
  username: string;
}

export interface SignupVerifyParams {
  code: number;
}

export interface SignupVerifyResult {
  access: string;
  refresh: string;
}
