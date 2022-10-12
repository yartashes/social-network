import Joi, { ObjectSchema } from 'joi';

import { UploadParams } from '../../../../services/media/interfaces';

export const uploadRequest: ObjectSchema<UploadParams> = Joi.object({
  name: Joi.string().required(),
  path: Joi.string().required(),
  authorId: Joi.number().required().positive(),
});
