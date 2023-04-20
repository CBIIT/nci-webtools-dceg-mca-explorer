import express from "express";
import { apiRouter } from "./services/api.js";
import { getConnection } from "./services/query.js";
import { getLogger } from "./services/logger.js";
import { logRequests, logErrors } from "./services/middleware.js";

main();

function main(env = process.env) {
  const app = createApp(env);
  return app.listen(env.API_PORT, () => app.locals.logger.info(`Application is running on port: ${env.API_PORT}`));
}

function createApp(env) {
  const app = express();
  app.locals.logger = getLogger("mosaic-tiler", env.LOG_LEVEL);
  app.locals.connection = getConnection(env.DATABASE_PATH);

  app.use(logRequests());
  app.use("/api", apiRouter);
  app.use(logErrors()); // logErrors should always be last
  return app;
}
