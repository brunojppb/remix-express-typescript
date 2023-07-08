import { installGlobals } from '@remix-run/node';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

installGlobals();

const publicPath = path.join(process.cwd(), 'public');
const publicBuildPath = path.join(process.cwd(), 'public', 'build');

// Make sure that only one instance of this server runs per process.
let didStartServer = false;

/**
 *
 * Start the Express server and give it a chance for the call-site
 * to setup hooks to our Express server before it starts.
 *
 * @param setupApp Allow the caller to add hooks to the Express app before we start. In this case, the Remix request handlers
 * @param onReady  Signals to the caller when the server has been started
 */
export async function startServer(
  setupApp: (app: express.Application) => Promise<void>,
  onReady: () => Promise<void>
) {
  // Make sure that you don't try to start the server
  // more than once per process.
  if (didStartServer) {
    throw new Error(
      'The Express server has already been started. You can only have one instance running per process.'
    );
  }

  didStartServer = true;

  const app = express();

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable('x-powered-by');

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    '/build',
    express.static(publicBuildPath, { immutable: true, maxAge: '1y' })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static(publicPath, { maxAge: '1h' }));

  app.use(morgan('tiny'));

  setupApp(app);

  const port = process.env.PORT || 3000;
  const server = app.listen(port, async () => {
    console.log(`Express server listening on port ${port}`);
    onReady();
  });

  process.once('SIGTERM', gracefullyShutdown);
  process.once('SIGINT', gracefullyShutdown);

  function gracefullyShutdown() {
    console.log('Express server is shutting down...');
    // Stop accepting HTTP connections
    server.close((err) => {
      if (err) {
        console.error('Error while shutting down Express server', err);
      }

      // Perform any clean-up before existing the process
      process.exit(0);
    });
  }
}
