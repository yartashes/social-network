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
};
