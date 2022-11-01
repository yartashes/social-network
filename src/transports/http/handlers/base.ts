import { BaseHandler } from '../../base-handler';
import { Sender } from '../sender/interfaces';
import { Services } from '../../../services';

export class HttpBaseHandler extends BaseHandler {
  protected sender: Sender;

  constructor(services: Services, sender: Sender) {
    super(services);

    this.sender = sender;
  }
}
