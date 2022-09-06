import path from 'path';
import stream from 'stream';

import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import { createWriteStream } from 'pino-sentry';
import {
  Level, multistream, prettyStream, Streams,
} from 'pino-multi-stream';
import pinoPretty from 'pino-pretty';
import dateformat from 'dateformat';

import { LoggerConfig } from '../../../configs/interfaces';

const TimeFormat = 'yyyy-mm-dd HH:MM:ss.l';
const StackTraceOffset = 2;
const { symbols: { asJsonSym } } = pino;
type PinoArg = Array<string | number | { package: string; caller?: string }>;

export class Logger {
  private readonly config: LoggerConfig;

  private readonly loggerStream?: stream.Duplex;

  constructor(config : LoggerConfig) {
    this.config = config;
    if (this.config.sentry.dsn) {
      this.loggerStream = createWriteStream(this.config.sentry);
    }
  }

  getLogger(module?: string): PinoLogger {
    let level = this.config.levels.any;
    const moduleName = module || 'main';

    if (this.config.levels[moduleName]) {
      level = this.config.levels[moduleName];
    }

    const options: LoggerOptions = {
      mixin: (): { package: string } => ({
        package: moduleName,
      }),
      base: null,
      timestamp: (): string => `,"time":"${dateformat(new Date(), TimeFormat)}"`,
      level,
      messageKey: 'message',
      formatters: {
        level: (label): { level: string } => ({ level: label }),
      },
    };

    const streams: Streams = [];

    if (this.config.prettry) {
      streams.push({
        stream: prettyStream({
          prettyPrint:
            {
              colorize: true,
              ignore: 'pid,hostname',
              timestampKey: 'time',
              translateTime: TimeFormat,
              // @ts-ignore
              singleLine: false,
            },
          prettifier: pinoPretty,
        }),
        level: level as Level,
      });
    } else {
      streams.push({
        stream: pino.destination(1),
        level: level as Level,
      });
    }

    if (this.loggerStream) {
      streams.push({
        level: 'warn',
        stream: this.loggerStream,
      });
    }

    const instance = pino(options, multistream(streams));

    if (['debug', 'trace'].includes(level)) {
      return new Proxy<pino.Logger>(
        instance,
        {
          get: (target, name): () => string => {
            if (name === asJsonSym) {
              return (...args: Array<any>): string => {
                const info = (
                  args[0] || Object.create(null)
                ) as { package: string; caller?: string };
                const error = new Error();
                info.caller = error.stack && error.stack
                  .split('\n')
                  .filter((s) => !s.includes(path.join('node_modules', 'pino')))[StackTraceOffset]
                  .replace(path.resolve(__dirname, '..'), '')
                  .replace(/^(.+\()(.*)(:\d+\))$/i, '$2')
                  .replace(/^\s+at\s+/i, '');
                // @ts-ignore
                return target[asJsonSym]
                  .call<pino.Logger, PinoArg, string>(target, ...args);
              };
            }
            // @ts-ignore
            return target[name];
          },
        },
      );
    }

    return instance;
  }
}
