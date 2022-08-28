import express from "express";
import Router from "express-promise-router";
import { getStatus, getSamples } from "./query.js";

export const apiRouter = new Router();

apiRouter.use(express.json());

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
