import { ResourceTypes } from './interfaces';

export const symbols = '0123456789abcdefghijklmnopqrstuvwxyz';

const kafkaTemplate = `import { KafkaBaseMigration } from '../base';

export default class {{className}} extends KafkaBaseMigration {
  private readonly name = '{{name}}';

  public async down(): Promise<void> {
    await this.client.deleteTopics({
      topics: <String[]>,
      timeout: <Number>, // default: 5000
    })
  }

  public async up(): Promise<void> {
    await this.client.createTopics({
      validateOnly: <boolean>,
      waitForLeaders: <boolean>
        timeout: <Number>,
      topics: <ITopicConfig[]>,
    });
  }

  public getName(): string {
    return this.name;
  }
}
`;

const postgresTemplate = `import { PostgresBaseMigration } from '../base';

export default class {{className}} extends PostgresBaseMigration {
  private readonly name = '{{name}}';

  public async down(): Promise<void> {
    await this.client.query(
      \`
        DROP TABLE table_name;
      \`,
    );
  }

  public async up(): Promise<void> {
    await this.client.query(
      \`
        CREATE TABLE table_name
        (
        );
      \`,
    );
  }

  public getName(): string {
    return this.name;
  }
}
`;

export const resourceTemplateMap: Record<ResourceTypes, string> = {
  [ResourceTypes.kafka]: kafkaTemplate,
  [ResourceTypes.postgres]: postgresTemplate,
};
