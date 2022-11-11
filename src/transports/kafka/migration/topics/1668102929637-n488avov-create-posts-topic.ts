import { BaseMigration } from '../base';

export class CreatePostsTopic extends BaseMigration {
  private readonly name = '1668102929637-n488avov-create-posts-topic';

  public async down(): Promise<void> {
    await this.client.deleteTopics({
      topics: [
        'posts',
      ],
    });
  }

  public async up(): Promise<void> {
    await this.client.createTopics({
      waitForLeaders: true,
      topics: [
        {
          topic: 'posts',
          numPartitions: 12,
          replicationFactor: this.replication,
          configEntries: [
            {
              name: 'retention.ms',
              value: '432000000',
            },
          ],
        },
      ],
    });
  }

  public getName(): string {
    return this.name;
  }
}
