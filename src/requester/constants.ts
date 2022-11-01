import { ServiceTypes } from '../libraries/constants/service-types';
import { TransportTypes } from '../libraries/constants/transport-types';

export const serviceTransportMap: Record<ServiceTypes, TransportTypes> = {
  [ServiceTypes.none]: TransportTypes.none,
  [ServiceTypes.auth]: TransportTypes.local,
  [ServiceTypes.medias]: TransportTypes.local,
  [ServiceTypes.posts]: TransportTypes.local,
  [ServiceTypes.users]: TransportTypes.local,
};
