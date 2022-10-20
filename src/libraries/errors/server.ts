import { ServerErrorCodes } from '../constants/server-error-codes';

export class ServerError extends Error {
  private readonly code: ServerErrorCodes;

  constructor(message: string, code: ServerErrorCodes) {
    super(message);

    this.code = code;
  }

  public getCode(): ServerErrorCodes {
    return this.code;
  }
}
