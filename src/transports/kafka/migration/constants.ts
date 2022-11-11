/* eslint-disable no-unused-vars */
export enum Direction {
  down = 'down',
  up = 'up',
}

export const symbols = '0123456789abcdefghijklmnopqrstuvwxyz';

export const template = `import { BaseMigration } from '../base';

export class {{className}} extends BaseMigration {
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
