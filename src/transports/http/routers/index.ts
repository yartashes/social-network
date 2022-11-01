import { Logger as PinoLogger } from 'pino';
import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { json } from 'body-parser';
import fileUpload from 'express-fileupload';

import { Services } from '../../../services';

import { Logger } from '../../../libraries/logger';
import { Jwt } from '../../../libraries/jwt';

import { Request } from '../interfaces';

import {
  ErrorMiddlewareHandler,
  MiddlewareHandler,
} from '../middlewares/interface';
import { AuthenticationMiddleware } from '../middlewares/authentication';
import { ErrorMiddleware } from '../middlewares/error';

import { Handlers } from '../handlers';

import { HttpRouter } from './interfaces';
import { SwaggerRouter } from './swagger-router';
import { AuthRouter } from './auth-router';
import { PostRouter } from './posts-router';
import { MediasRouter } from './medias-router';

export class Routes {
  private readonly log: PinoLogger;

  private readonly logger: Logger;

  private readonly express: Express;

  private readonly preMiddlewares: Array<MiddlewareHandler>;

  private readonly endpoints: Array<HttpRouter>;

  private readonly postMiddlewares: Array<MiddlewareHandler>;

  private readonly errorMiddlewares: Array<ErrorMiddlewareHandler>;

  constructor(
    services: Services,
    handlers: Handlers,
    express: Express,
    jwt: Jwt,
    logger: Logger,
  ) {
    this.express = express;
    this.logger = logger;
    this.log = logger.getLogger('http-routes');

    this.preMiddlewares = [
      new AuthenticationMiddleware(services.auth, jwt, logger),
    ];
    this.endpoints = this.initEndpoints(handlers);
    this.postMiddlewares = [];
    this.errorMiddlewares = [
      new ErrorMiddleware(logger),
    ];
  }

  public init(): void {
    this.express.use(fileUpload({
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      useTempFiles: true,
      tempFileDir: './tmp/upload/',
    }));
    this.express.use(json());

    this.preMiddlewares
      .forEach((item) => {
        this.express.use((
          req: ExpressRequest,
          res: ExpressResponse,
          next: NextFunction,
        ) => {
          const newReq = req as Request;

          item.handler(newReq, res, next);
        });
      });

    this.endpoints
      .forEach((item) => {
        this.express
          .use(item.path, item.init());
      });

    this.postMiddlewares
      .forEach((item) => {
        this.express.use((
          req: ExpressRequest,
          res: ExpressResponse,
          next: NextFunction,
        ) => {
          const newReq = req as Request;

          item.handler(newReq, res, next);
        });
      });

    this.errorMiddlewares
      .forEach((item) => {
        this.express.use((
          err: Error,
          req: ExpressRequest,
          res: ExpressResponse,
          next: NextFunction,
        ) => {
          const newReq = req as Request;

          item.handler(err, newReq, res, next);
        });
      });
  }

  private initEndpoints(handlers: Handlers): Array<HttpRouter> {
    return [
      new SwaggerRouter(handlers, this.logger),
      new AuthRouter(handlers, this.logger),
      new PostRouter(handlers, this.logger),
      new MediasRouter(handlers, this.logger),
    ];
  }
}
