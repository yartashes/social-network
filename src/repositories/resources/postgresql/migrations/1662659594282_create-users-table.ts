/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(
    't_users',
    {
      id: 'id',
      email: {
        type: 'varchar(100)',
        notNull: true,
        unique: true,
      },
      username: {
        type: 'varchar(100)',
        notNull: true,
        unique: true,
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      updated_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func('current_timestamp'),
      },
      deleted_at: {
        type: 'timestamp',
        notNull: false,
      },
    },
    {
      ifNotExists: true,
    },
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(
    't_users',
    {
      ifExists: true,
    },
  );
}
