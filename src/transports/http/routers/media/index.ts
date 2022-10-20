import { Logger as PinoLogger } from 'pino';
import { NextFunction, Response as ExpressResponse, Router } from 'express';

import { UploadedFile } from 'express-fileupload';

import { Logger } from '../../../../libraries/logger';

import { ClientError } from '../../../../libraries/errors/client';

import { HttpStatusCodes } from '../../../../libraries/constants/http-status-codes';

import { Services } from '../../../../services';
import { UploadParams } from '../../../../services/media/interfaces';

import { Request } from '../../interfaces';

import { HttpRouter } from '../interfaces';

import { UploadResponse } from './interfaces';
import { uploadRequest } from './constants';

export class MediaRouter implements HttpRouter {
  private readonly log: PinoLogger;

  private readonly services: Services;

  constructor(services: Services, logger: Logger) {
    this.services = services;

    this.log = logger.getLogger('http-media-router');
  }

  public get path(): string {
    return '/api/media';
  }

  public init(): Router {
    this.log.info('Media router init');
    const router = Router();

    router
      .post(
        '/upload',
        async (req, res, next) => {
          const newReq = req as Request;

          return this.upload(newReq, res, next);
        },
      );

    return router;
  }

  private async upload(
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
