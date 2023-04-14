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
  const study = request.body.search
  const searcharr = []
 //if there is more studies, study is an array, if there is only one, study is json object
  study.length ? 
  study.forEach(element => {
     searcharr.push({term:{dataset:element.value}})
  }):
  searcharr.push({term:{dataset:study.value}})
console.log(searcharr)
const client = new Client({
  //node: 'http://localhost:9200',
  // auth: {
  //   username: 'admin',
  //   password: 'admin'
  // }
    node: host,
    ssl: {
      rejectUnauthorized: false
    }
});

 try {
    const result = await client.search({
      index: 'mcaexplorer',
      body: {
        track_total_hits: true,
        size:10000,
        query :{
          bool:{
            should:searcharr
          }
        }

        // query: {
        //   match: {
        //     dataset: 'plco'
        //   }
        // }
      }
    });
    //console.log(result.body.hits.hits.length)
    response.json(result.body.hits.hits)
  } catch (error) {
    console.error(error);
  }

})

apiRouter.post("/opensearch/gene", async (request, response) => {
  const { logger } = request.app.locals;
  // var client = new Client({
  //   node: host,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // })
const search = request.body.search
const xMax = search.xMax
const xMin = search.xMin
const chr = search.chr
//console.log(search, xMax,chr)
const client = new Client({
   node: host,
    ssl: {
      rejectUnauthorized: false
    }
});

 try {
    const result = await client.search({
      index: 'combinedgene',
      body: {
        track_total_hits: true,
        size:10000,
        query :{
         bool: {
          must: [
            {
              range: {
                transcriptionStart: {
                  gt: xMin
                }
              }
            },
             {
              range: {
                transcriptionEnd: {
                  lt: xMax
                }
              }
            },
            {
              match: {
                chromosome: chr
              }
            }
           ]
         }
        }

        // query: {
        //   match: {
        //     dataset: 'plco'
        //   }
        // }
      }
    });
    //console.log(result.body.hits)
    response.json(result.body.hits.hits)
  } catch (error) {
    console.error(error);
  }

})
