const isProd = process.env.NODE_ENV === "production";

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  serverModuleFormat: "cjs",
  // This is a bug in Remix.
  // If we declare the server file and try to run the dev server, it will not include
  // the routes and the server won't boot properly. We can only do that in production builds for now.
  // But please, have a look at the `server/dev.ts` and ` server/prod.ts` to see the
  // difference during server startup time.
  // See: https://github.com/remix-run/remix/issues/3032
  ...(isProd
    ? {
        server: "server/prod.ts",
        serverBuildPath: "build/index.js",
      }
    : {}),
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  },
};
