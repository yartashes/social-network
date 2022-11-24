import { PostgresBaseMigration } from '../base';

export default class CreateUserTable extends PostgresBaseMigration {
  private readonly name = '1669311883200-8hu8mtqa-create-user-table';

  public async down(): Promise<void> {
    await this.client.query(
      `
        DROP TABLE t_users;
      `,
    );
  }

  public async up(): Promise<void> {
    await this.client.query(
      `
        CREATE TABLE t_users
        (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
            deleted_at TIMESTAMP
        );
      `,
    );
  }

  public getName(): string {
    return this.name;
  }
}
