import Joi, { CustomHelpers, Schema } from 'joi';

import { BaseValidator } from '../base';

import { ValidationFailResult } from '../interfaces';

export class ObjectId extends BaseValidator {
  public get type(): string {
    return 'objectId';
  }

  public set type(value: string) {}

  public get base(): Schema {
    return Joi.string();
  }

  public set base(value: Schema) {}

  public get messages(): Record<string, string> {
    return {
      'objectId.base': '{{#label}} must be valid objectId',
    };
  }

  public set messages(value: Record<string, string>) {}

  public validate(value: string, helpers: CustomHelpers): ValidationFailResult | undefined {
    if (!/^[0-9|a-f|A-F]{24}$/.test(value)) {
      return {
        value,
        error: helpers.error('objectId.base'),
      };
    }

    return undefined;
  }
}
