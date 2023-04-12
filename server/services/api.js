import express, { response } from "express";
import Router from "express-promise-router";
import { getStatus, getSamples } from "./query.js";
import cors from "cors"
import { Client } from '@opensearch-project/opensearch';
const { APP_BASE_URL, ADMIN, PASSWORD, DOMAIN } = process.env;


export const apiRouter = new Router();

apiRouter.use(cors());
apiRouter.use(express.json());

const host = `http://${ADMIN}:${PASSWORD}@${DOMAIN}`;

apiRouter.get("/ping", async (request, response) => {
  const { connection } = request.app.locals;
  const status = await getStatus(connection);
  response.json(status);
});

apiRouter.post("/query/samples", async (request, response) => {
  const { connection } = request.app.locals;
  const query = request.body;
  const samples = await getSamples(connection, query);
  response.json(samples);
});

apiRouter.post("/opensearch", async (request, response) => {
  const { logger } = request.app.locals;
  // var client = new Client({
  //   node: host,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // })
const client = new Client({
  node: 'http://localhost:9200',
  auth: {
    username: 'admin',
    password: 'admin'
  }
});

 try {
    const result = await client.search({
      index: 'mcaexplorer',
      body: {
        size: 10,
        query: {
          match: {
            dataset: 'plco'
          }
        }
      }
    });
    response.json(result.body.hits.hits)
  } catch (error) {
    console.error(error);
  }

})
