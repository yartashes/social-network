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

export interface SignInParams {
  email: string;
}

export interface SignInVerifyParams {
  code: number;
}

export interface SignInVerifyResult {
  access: string;
  refresh: string;
}

export interface ExchangeParams {
  token: string;
}

export interface ExchangeResult {
  access: string;
  refresh: string;
}

export interface GetUserByEmailOrUsernameRequest {
  email: string;
  username: string;
}

export interface UserCreateRequest {
  email: string;
  username: string;
}
