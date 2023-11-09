import * as fs from 'node:fs';
import * as url from 'node:url';

import { createRequestHandler } from '@remix-run/express';
import { broadcastDevReady, type ServerBuild } from '@remix-run/node';
import type express from 'express';
import morgan from 'morgan';

import { BUILD_PATH, startServerLifecycle, VERSION_PATH } from './base';

let build = await import(BUILD_PATH);

startServerLifecycle(
  async (app) => {
    app.use(morgan('tiny'));

    const remixHandler = await createDevHandler(build);

    app.all('*', remixHandler);
  },
  function onReady() {
    console.info('Express server started in dev mode');
    broadcastDevReady(build);
  }
);

async function createDevHandler(initialBuild: ServerBuild) {
  let build = initialBuild;

  const chokidar = await import('chokidar');

  chokidar
    .watch(VERSION_PATH, { ignoreInitial: true })
    .on('add', handleServerUpdate)
    .on('change', handleServerUpdate);

  async function handleServerUpdate() {
    // 1. re-import the server build
    build = await reimportServer();
    // 2. tell Remix that this app server is now up-to-date and ready
    broadcastDevReady(build);
  }

  // wrap request handler to make sure its recreated with the latest build for every request
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      return createRequestHandler({
        build,
        mode: 'development',
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

async function reimportServer(): Promise<ServerBuild> {
  const stat = fs.statSync(BUILD_PATH);

  // convert build path to URL for Windows compatibility with dynamic `import`
  const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

  // use a timestamp query parameter to bust the import cache
  return import(BUILD_URL + '?t=' + stat.mtimeMs);
}
