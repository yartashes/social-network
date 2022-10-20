/* eslint-disable @typescript-eslint/no-unused-vars */
import { CustomHelpers, Extension } from 'joi';

import { ServerError } from '../errors/server';
import { ServerErrorCodes } from '../constants/server-error-codes';
import { ValidationFailResult } from './interfaces';

export class BaseValidator implements Extension {
  public get type(): string {
    throw new ServerError(
      'Getter not implemented',
      ServerErrorCodes.validationTypeGetterNotImplemented,
    );
  }

  public get messages(): Record<string, string> {
    throw new ServerError(
      'Getter not implemented',
      ServerErrorCodes.validationMessagesGetterNotImplemented,
    );
  }

  public validate(value: unknown, helpers: CustomHelpers): ValidationFailResult | undefined {
    throw new ServerError(
      'Method not implemented',
      ServerErrorCodes.validationValidateGetterNotImplemented,
    );
  }
}
