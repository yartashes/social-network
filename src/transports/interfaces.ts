import { TransportTypes } from '../libraries/constants/transport-types';
import { ServiceTypes } from '../libraries/constants/service-types';

export interface Handler {
  readonly service: ServiceTypes
}

export interface Handlers {
  getHandlers(): Array<Handler>;
}

export interface HandlerInfo {
  readonly type: TransportTypes;
  readonly handlers: Handlers;
}

export interface Transport {
  readonly handlerInfo: HandlerInfo;
  start(): Promise<void>;
  stop(): Promise<void>;
}
