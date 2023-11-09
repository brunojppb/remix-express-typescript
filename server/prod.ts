/**
 * This is a bit of a weird issue with Remix when using the Express Adapter.
 * When we declare the 'server' entry in the remix.config.js, the remix build
 * goes haywire and does not produce the server routes, which completely breaks
 * the server-side rendering pipeline.
 *
 * By importing this server-build directly from the Remix package, the server
 * build will now include the routes correctly in the output file.
 *
 * This is an outstanding issue already reported to the remix folks.
 * In the meantime, we can use this hack to perform a production build.
 * the @remix-run/dev/server-build import throws an error if we try to use during development
 * See this long-standing issue: https://github.com/remix-run/remix/issues/3032#issuecomment-1427333907
 */
import * as build from '@remix-run/dev/server-build';
import { createRequestHandler } from '@remix-run/express';

import { startServerLifecycle } from './base';

startServerLifecycle(
  async (app) => {
    /**
     * Here we are passing the build derived by the Remix compiler.
     * During compilation, remix will include the right build files here.
     * See here for the Deno deployment target: https://github.com/remix-run/remix/blob/76327d3b9dcfbb93fd57cd9254a7b66342aba704/templates/deno/server.ts#L3-L4
     * See here for Netlify: https://github.com/remix-run/remix/blob/76327d3b9dcfbb93fd57cd9254a7b66342aba704/templates/netlify/server.ts#L1C1-L1C1
     */
    app.all(
      '*',
      createRequestHandler({
        build,
        mode: 'production',
      })
    );
  },
  function onReady() {
    console.info('server started with PRODUCTION build');
  }
);
