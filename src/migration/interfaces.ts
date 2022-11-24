import { Config } from '../../configs/interfaces';

import { BaseMigration } from './base';

export enum Directions {
  none = '',
  up = 'up',
  down = 'down',
}

export enum ResourceTypes {
  postgres = 'postgres',
  kafka = 'kafka',
}

export interface MigrationData {
  instance: BaseMigration;
  version: string;
  direction: Directions;
}

export interface Migration {
  readonly type: ResourceTypes;
  connect(config: Config): Promise<void>;
  run(version: string): Promise<void>;
}
