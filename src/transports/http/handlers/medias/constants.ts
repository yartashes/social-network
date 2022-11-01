import { ObjectSchema } from 'joi';

import validator from '../../../../libraries/validations';

import { UploadParams } from '../../../../services/medias/interfaces';

export const uploadRequest: ObjectSchema<UploadParams> = validator.object({
  name: validator.string().required(),
  path: validator.string().required(),
  authorId: validator.number().required().positive(),
});
