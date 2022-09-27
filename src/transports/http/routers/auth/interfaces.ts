export interface SignupResponse {
  result: boolean;
}

export interface SignupVerifyResponse {
  result: {
    access: string;
    refresh: string;
  };
}
