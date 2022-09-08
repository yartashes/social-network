import { Logger as PinoLogger } from 'pino';
import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { Logger } from '../../../../libraries/logger';

import { HttpRouter } from '../interfaces';

import api from '../../../../../api/api.json';

export class SwaggerRouter implements HttpRouter {
  private readonly log: PinoLogger;

  constructor(logger: Logger) {
    this.log = logger.getLogger('http-swagger-router');
  }

  public get path(): string {
    return '/docs/swagger';
  }

  public init(): Router {
    this.log.info('Swagger router init');
    const router = Router();

    router
      .use(swaggerUi.serve)
      .get(
        '/',
        swaggerUi.setup(api),
      );

    return router;
  }
}
