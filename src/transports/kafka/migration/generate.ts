/* eslint-disable no-console,import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';

import { white } from 'chalk';
import boxen, { BorderStyle, Options } from 'boxen';
import { command } from 'yargs';
import { compile } from 'handlebars';
import _ from 'lodash';

import { symbols, template } from './constants';

class Generate {
  private readonly version = 'v1.0.0';

  private readonly randomPrefixLength = 8;

  public async run(): Promise<unknown> {
    const boxenOptions: Options = {
      padding: 1,
      margin: 1,
      borderStyle: BorderStyle.Round,
      borderColor: 'green',
      backgroundColor: '#555555',
    };
    console.log(boxen(white.bold('Generate migration file'), boxenOptions));

    return command(
      'generate [name]',
      'Generate migration file',
      {},
      async (argv) => {
        await this.generate(argv.name as string);
      },
    )
      .help('h')
      .alias('h', 'help')
      .version(this.version)
      .argv;
  }

  private async generate(name: string): Promise<void> {
    const fileName = this.fileName(name);
    const filePath = this.path();

    const render = compile(template);

    return fs.promises
      .writeFile(
        path.join(filePath, `${fileName}.ts`),
        render({
          className: _.upperFirst(
            _.camelCase(name),
          ),
          name: fileName,
        }),
      );
  }

  private fileName(name: string): string {
    const prefix = new Array(this.randomPrefixLength)
      .fill(1)
      .map(() => symbols[Math.floor(Math.random() * 36)])
      .join('');

    return `${Date.now()}-${prefix}-${name}`;
  }

  private path(): string {
    return path.resolve(
      path.join(
        'src',
        'transports',
        'kafka',
        'migration',
        'topics',
      ),
    );
  }
}

(async function main() {
  return new Generate().run();
}());
