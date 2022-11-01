export interface SignupResponse {
  result: boolean;
}

export interface SignupVerifyResponse {
  result: {
    access: string;
    refresh: string;
  };
}

export interface SignInResponse {
  result: boolean;
}

export interface SignInVerifyResponse {
  result: {
    access: string;
    refresh: string;
  };
}

export interface ExchangeResponse {
  result: {
    access: string;
    refresh: string;
  };
}
