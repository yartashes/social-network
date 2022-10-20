import { HttpStatusCodes } from '../constants/http-status-codes';

export class ClientError extends Error {
  private readonly code: HttpStatusCodes;

  constructor(message: string, code: HttpStatusCodes) {
    super(message);

    this.code = code;
  }

  public getCode(): HttpStatusCodes {
    return this.code;
  }
}
