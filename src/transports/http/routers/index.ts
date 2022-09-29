import { Logger as PinoLogger } from 'pino';
import {
  Express,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express';
import { json } from 'body-parser';

import { Logger } from '../../../libraries/logger';

import { Request } from '../interfaces';
import {
  ErrorMiddlewareHandler,
  MiddlewareHandler,
} from '../middlewares/interface';

import { HttpRouter } from './interfaces';
import { SwaggerRouter } from './swagger';
import { Services } from '../../../services';
import { AuthRouter } from './auth';
import { ErrorMiddleware } from '../middlewares/error';
import { PostRouter } from './posts';
import { AuthenticationMiddleware } from '../middlewares/authentication';
import { Jwt } from '../../../libraries/jwt';

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
    express: Express,
    jwt: Jwt,
    logger: Logger,
  ) {
    this.express = express;
    this.logger = logger;
    this.log = logger.getLogger('http-routes');

    this.preMiddlewares = [
      new AuthenticationMiddleware(services.users, jwt, logger),
    ];
    this.endpoints = this.initEndpoints(services);
    this.postMiddlewares = [];
    this.errorMiddlewares = [
      new ErrorMiddleware(logger),
    ];
  }

  public init(): void {
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

  private initEndpoints(services: Services): Array<HttpRouter> {
    return [
      new SwaggerRouter(this.logger),
      new AuthRouter(services, this.logger),
      new PostRouter(services, this.logger),
    ];
  }
}
