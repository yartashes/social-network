import { NextFunction, Response as ExpressResponse } from 'express';
import { UploadedFile } from 'express-fileupload';

import { ClientError } from '../../../../libraries/errors/client';
import { HttpStatusCodes } from '../../../../libraries/constants/http-status-codes';
import { ServiceTypes } from '../../../../libraries/constants/service-types';

import { UploadParams } from '../../../../services/medias/interfaces';

import { Request } from '../../interfaces';

import { HttpBaseHandler } from '../base';

import { uploadRequest } from './constants';
import { UploadResponse } from './interfaces';

export class MediasHandler extends HttpBaseHandler {
  public get service(): ServiceTypes {
    return ServiceTypes.medias;
  }

  public async upload(
    req: Request,
    res: ExpressResponse,
    next: NextFunction,
  ): Promise<unknown> {
    try {
      if (!req.files || !req.files.file) {
        return next(new ClientError(
          'File filed is required',
          HttpStatusCodes.badRequest,
        ));
      }

      const file = req.files.file as UploadedFile;

      if (!this.fileTypeWhiteList.includes(file.mimetype)) {
        return next(new ClientError(
          'Invalid file type',
          HttpStatusCodes.badRequest,
        ));
      }

      const params: UploadParams = {
        name: file.name,
        path: file.tempFilePath,
        authorId: req.user.id as bigint,
      };

      const validation = uploadRequest.validate(params);

      if (validation.error) {
        return next(validation.error);
      }

      const result = await this
        .services
        .media
        .upload(params);

      const response: UploadResponse = {
        result,
      };

      return res.json(response);
    } catch (e) {
      next(e);
    }

    return undefined;
  }

  private get fileTypeWhiteList(): Array<string> {
    return [
      'image/png',
    ];
  }
}
