/* eslint-disable @typescript-eslint/no-unused-vars */
import path from 'path';

import glob from 'glob';
import { Logger } from 'pino';

import { ServerError } from '../libraries/errors/server';
import { ServerErrorCodes } from '../libraries/constants/server-error-codes';

import {
  Directions,
  MigrationData,
  ResourceTypes,
} from './interfaces';

export class Executor {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public get type(): ResourceTypes {
    throw new ServerError(
      'Getter not implemented',
      ServerErrorCodes.migrationTypeGetterNotImplemented,
    );
  }

  protected async getMigrations(
    lastVersion: string,
    currentVersion: string,
  ): Promise<Array<MigrationData>> {
    if (lastVersion === currentVersion) {
      return [];
    }

    let direction = Directions.up;

    if (lastVersion > currentVersion) {
      direction = Directions.down;
    }

    const rootPath = path.resolve(
      path.join(
        __dirname,
        this.type,
        'migrations',
      ),
    );
    const files = await new Promise<Array<string>>(
      (resolve, reject) => {
        glob(
          '*.@(ts|js)',
          {
            cwd: rootPath,
            absolute: true,
          },
          (err, items) => {
            if (err) {
              return reject(err);
            }

            return resolve(items);
          },
        );
      },
    );

    const migrationClasses = await this.createMigrationInstance(direction, files);

    return migrationClasses.filter((migration) => {
      switch (true) {
      case direction === Directions.up
        && migration.version > lastVersion
        && migration.version <= currentVersion:
        return true;
      case direction === Directions.down
        && migration.version <= lastVersion
        && migration.version > currentVersion:
        return true;
      default:
        return false;
      }
    });
  }

  protected async createMigrationInstance(
    direction: Directions,
    files: Array<string>,
  ): Promise<Array<MigrationData>> {
    throw new ServerError(
      'Method not implemented',
      ServerErrorCodes.migrationCreateInstanceMethodNotImplemented,
    );
  }

  protected static async load<T>(migrationPath: string): Promise<T> {
    const loaded = await import(migrationPath);

    return loaded.default as T;
  }
}
