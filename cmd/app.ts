/* eslint-disable no-console */
import path from 'path';
import { AppServer } from '../src/apps/app';

async function main() {
  const rootPath = path.join(__dirname, '..');

  const server = new AppServer(rootPath);

  process.once('SIGTERM', async () => {
    console.log('SIGTERM received');

    // return server.stop();
  });
  process.once('SIGINT', async () => {
    console.log('SIGINT received');

    // return server.stop();
  });

  // return server.run(rootPath);
}

main()
  .catch(console.error);
