import { Transport, Handler } from '../transports/interfaces';

import { ServerError } from '../libraries/errors/server';

import { ServerErrorCodes } from '../libraries/constants/server-error-codes';
import { TransportTypes } from '../libraries/constants/transport-types';
import { ServiceTypes } from '../libraries/constants/service-types';

import { serviceTransportMap } from './constants';

export class Requester {
  private readonly handlers: Partial<
    Record<TransportTypes, Partial<Record<ServiceTypes, Handler>>>
  > = {};

  public set transports(value: Array<Transport>) {
    if (Object.keys(this.handlers).length === 0) {
      value.forEach((transport) => {
        const { type, handlers } = transport.handlerInfo;

        if (!this.handlers[type]) {
          this.handlers[type] = {};
        }

        const map = this.handlers[type];

        handlers.getHandlers().forEach((handler) => {
          if (map !== undefined) {
            map[handler.service] = handler;
          }
        });
      });
    }
  }

  public async call<Req, Res>(
    service: ServiceTypes,
    methodName: string,
    request: Req,
  ): Promise<Res> {
    const transportType = serviceTransportMap[service];

    if (!transportType) {
      throw new ServerError(
        'Service transport is undefined',
        ServerErrorCodes.serviceTransportIsUndefined,
      );
    }

    const handlers = this.handlers[transportType];

    if (!handlers) {
      throw new ServerError(
        'Transport handlers is undefined',
        ServerErrorCodes.transportHandlersIsUndefined,
      );
    }

    const handler = handlers[service];

    if (!handler) {
      throw new ServerError(
        'Service handler is undefined',
        ServerErrorCodes.serviceHandlerIsUndefined,
      );
    }

    const method = handler[methodName];

    if (!method) {
      throw new ServerError(
        `Service '${methodName}' method not found`,
        ServerErrorCodes.serviceMethodNotFound,
      );
    }

    return method(request) as Res;
  }
}
