import { Logger } from 'pino';
import { Admin } from 'kafkajs';

export class BaseMigration {
  private readonly logger: Logger;

  protected readonly client: Admin;

  protected readonly replication: number;

  constructor(client: Admin, logger: Logger, replication: number) {
    this.logger = logger;
    this.client = client;
    this.replication = replication;
  }

  public async up(): Promise<void> {
    throw new Error('not implemented');
  }

  public async down(): Promise<void> {
    throw new Error('not implemented');
  }

  public getName(): string {
    throw new Error('not implemented');
  }
}
