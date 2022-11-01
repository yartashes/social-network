import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import api from '../../../../api/api.json';

import { HttpRouter } from './interfaces';
import { BaseRouter } from './base';

export class SwaggerRouter extends BaseRouter implements HttpRouter {
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
