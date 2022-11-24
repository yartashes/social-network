/* eslint-disable no-console,import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';

import { green, white } from 'chalk';
import boxen, { BorderStyle, Options } from 'boxen';
import { command } from 'yargs';
import { compile } from 'handlebars';
import _ from 'lodash';

import { symbols, resourceTemplateMap } from './constants';
import { ResourceTypes } from './interfaces';

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
      {
        type: {
          alias: 't',
          type: 'string',
          demandOption: true,
          description: green('choose data base type'),
          default: ResourceTypes.postgres,
          choices: Object.keys(resourceTemplateMap),
        },
      },
      async (argv) => {
        console.log(argv.name, argv.type);
        await this.generate(argv.name as string, argv.type as ResourceTypes);
      },
    )
      .help('h')
      .alias('h', 'help')
      .version(this.version)
      .argv;
  }

  private async generate(name: string, type: ResourceTypes): Promise<void> {
    const fileName = this.fileName(name);
    const filePath = this.path(type);
    const template = resourceTemplateMap[type];

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

  private path(type: ResourceTypes): string {
    return path.resolve(
      path.join(
        'src',
        'migration',
        type,
        'migrations',
      ),
    );
  }
}

(async function main() {
  return new Generate().run();
}());
