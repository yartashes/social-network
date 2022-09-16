import { Schema } from 'convict';
import { Config } from './interfaces';

export const configSchema: Schema<Config> = {
  transports: {
    http: {
      port: {
        default: 3456,
        env: 'TRANSPORTS_HTTP_PORT',
        format: 'port',
      },
      host: {
        default: '127.0.0.1',
        env: 'TRANSPORTS_HTTP_HOST',
      },
    },
  },
  logger: {
    levels: {},
    prettry: {
      default: true,
      env: 'LOGGER_PRETTRY',
    },
    sentry: {
      dsn: {
        env: 'LOGGER_SENTRY_DSN',
        default: null,
      },
    },
  },
  resources: {
    postgres: {
      host: {
        default: '127.0.0.1',
        env: 'PG_HOST',
      },
      port: {
        default: 5432,
        env: 'PG_PORT',
        format: 'port',
      },
      db: {
        default: 'social_networks',
        env: 'PG_DB',
      },
      user: {
        default: '',
        env: 'PG_USER',
        nullable: false,
      },
      password: {
        default: '',
        env: 'PG_PASS',
        nullable: false,
      },
    },
    mailjet: {
      public: {
        default: '',
        format: String,
        nullable: false,
        env: 'MAILJET_KEY',
      },
      private: {
        default: '',
        format: String,
        nullable: false,
        env: 'MAILJET_SECRET',
      },
    },
    redis: {
      host: {
        default: '127.0.0.1',
        format: String,
        env: 'REDIS_HOST',
      },
      port: {
        default: 6379,
        format: 'port',
        env: 'REDIS_PORT',
      },
      db: {
        default: 0,
        format: Number,
        env: 'REDIS_DB',
      },
    },
  },
};
