# Remix Express Starter

This repo is a Remix starter project that circunvents one of the Remix issues
when compiling the server adapter code, in this case, Express, together with
Remix.

I created this project to circumvent a long-standing issue where
[setting server in remix.config.js fails when using express adapter](https://github.com/remix-run/remix/issues/3032),
which makes the Remix compiler not to include the Remix routes in the final
bundle.

This project fixes that for both development and production builds.

This setup uses:

- [tsx](https://github.com/esbuild-kit/tsx) for development so we can boot Remix
  and our Express server directly from our TypeScript files
- [node](https://nodejs.org/en) for booting up the production build
- [Docker](https://www.docker.com/) for building a reproducible production-ready
  image

This project gives you two entry-points:

1. One for development which has HMR support
1. One for production, which is hooked up with the Remix compiler build process
   so you can run it directly from the Remix compiler output.

## Development

First install all dependencies with:

```shell
npm install
```

Start the Remix development asset server and the Express server by running:

```shell
npm run dev
```

This starts your app in development mode, which will purge the server cache when
Remix rebuilds assets so you don't need a process manager restarting the express
server. This setup uses [Chokidar](https://github.com/paulmillr/chokidar) to
listen to file changes in the build folder which notifies the Remix frontend,
allowing Hot-module replacement to work.

This setup is explained by [Pedro Cattori](https://github.com/pcattori) on the
migration to Remix v2
[here.](https://www.youtube.com/watch?v=6jTL8GGbIuc&t=256s)

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

## Docker

This template includes a Dockerfile which builds a production-ready Docker image
for you. Just run the following command:

```shell
docker build .
```

### DIY

If you're familiar with deploying express applications you should be right at
home just make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
