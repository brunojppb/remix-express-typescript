import * as build from "@remix-run/dev/server-build";
import { startServer } from "./base";
import { createRequestHandler } from "@remix-run/express";

startServer(
  async (app) => {
    app.all(
      "*",
      createRequestHandler({
        build,
        mode: "production",
      })
    );
  },
  async () => {
    console.log("Express server started in PRODUCTION mode");
  }
);
