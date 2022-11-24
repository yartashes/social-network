import { Logger } from 'pino';
import { ServerError } from '../libraries/errors/server';
import { ServerErrorCodes } from '../libraries/constants/server-error-codes';

export class BaseMigration {
  protected readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public async up(): Promise<void> {
    throw new ServerError(
      'Method not implemented',
      ServerErrorCodes.migrationUpMethodNotImplemented,
    );
  }

  public async down(): Promise<void> {
    throw new ServerError(
      'Method not implemented',
      ServerErrorCodes.migrationDownMethodNotImplemented,
    );
  }

  public getName(): string {
    throw new ServerError(
      'Method not implemented',
      ServerErrorCodes.migrationGetNameNotImplemented,
    );
  }
}
