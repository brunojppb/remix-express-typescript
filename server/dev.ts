import fs from "node:fs";
import path from "node:path";
import chokidar from "chokidar";
import { startServer } from "./base";
import { broadcastDevReady } from "@remix-run/node";
import { createRequestHandler } from "@remix-run/express";
import type express from "express";

const BUILD_PATH = path.join(process.cwd(), "build", "index.js");
/**
 * @type { import('@remix-run/node').ServerBuild | Promise<import('@remix-run/node').ServerBuild> }
 */
let build = import(BUILD_PATH);

startServer(
  async (app) => {
    app.all("*", createDevRequestHandler());
  },
  async () => {
    broadcastDevReady(await build);
    console.log("Express server started in DEV mode");
  }
);

function createDevRequestHandler() {
  const watcher = chokidar.watch(BUILD_PATH, { ignoreInitial: true });

  watcher.on("all", async () => {
    // 1. purge require cache && load updated server build
    const stat = fs.statSync(BUILD_PATH);
    let build = import(BUILD_PATH + "?t=" + stat.mtimeMs);
    // 2. tell dev server that this app server is now ready
    broadcastDevReady(await build);
  });

  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      //
      return createRequestHandler({
        build: await build,
        mode: "development",
      })(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
