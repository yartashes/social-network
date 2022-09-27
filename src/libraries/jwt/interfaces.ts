export enum TokenType {
  none = 0,
  access = 1,
  refresh = 2,
}

export interface Payload {
  id: bigint;
  type: TokenType;
}

export interface Result {
  access: string;
  refresh: string
}
