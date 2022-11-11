import { Logger } from 'pino';
import { Admin } from 'kafkajs';

export class Migration {
  private readonly log: Logger;

  private readonly client: Admin;

  private readonly replication: number;

  private readonly migrationTopic = 'migrations';

  constructor(client: Admin, log: Logger, replication: number) {
    this.client = client;
    this.log = log;
    this.replication = replication;
  }

  public async migrate(version: string): Promise<void> {
    await this.init();
  }

  private async init(): Promise<void> {
    const topics = await this.client.listTopics();

    if (topics.includes(this.migrationTopic)) {
      return undefined;
    }

    await this.client.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: this.migrationTopic,
          numPartitions: 1,
          replicationFactor: this.replication,
          configEntries: [
            {
              name: 'retention.ms',
              value: '-1',
            },
          ],
        },
      ],
    });

    return undefined;
  }
}
