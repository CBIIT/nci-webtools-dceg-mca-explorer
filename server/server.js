import express from "express";
import { apiRouter } from "./services/api.js";
import { getConnection } from "./services/query.js";
import { getLogger } from "./services/logger.js";
import { logRequests, logErrors } from "./services/middleware.js";

main();

function main(env = process.env) {
  const app = createApp(env);
  return app.listen(env.PORT, () => app.locals.logger.info(`Application is running on port: ${env.PORT}`));
}

function createApp(env) {
  const app = express();
  app.locals.logger = getLogger("mosaic-tiler", env.LOG_LEVEL);
  app.locals.connection = getConnection(env.DATABASE_PATH);

  app.use(logRequests());
  console.log(`${env.BASE_URL}/api`)
  app.use(`${env.BASE_URL}/api`, apiRouter);
  app.use(logErrors()); // logErrors should always be last
  return app;
}
