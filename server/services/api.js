import express, { response } from "express";
import Router from "express-promise-router";
import { getStatus, getSamples } from "./query.js";
import cors from "cors";
import { Client } from "@opensearch-project/opensearch";
const { APPLICATION_NAME, BASE_URL, OPENSEARCH_USERNAME, OPENSEARCH_PASSWORD, OPENSEARCH_ENDPOINT } = process.env;

export const apiRouter = new Router();

apiRouter.use(cors());
apiRouter.use(express.json());

//const host = `https://${OPENSEARCH_USERNAME}:${OPENSEARCH_PASSWORD}@${OPENSEARCH_ENDPOINT}`;
const host = `https://${OPENSEARCH_ENDPOINT}`;

console.log("opensearch host is:", host);
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

apiRouter.post("/opensearch/mca", async (request, response) => {
  const { logger } = request.app.locals;

  const qdataset = request.body.dataset;
  const qsex = request.body.sex;
  console.log(qdataset, qsex);
  //serach only rows which has chromosome, this will exclude plcoDenominator
  const filterString = [{ terms: { "type.keyword": ["Gain", "Loss", "CN-LOH", "Undetermined", "mLOX", "mLOY"] } }];
  const searchdataset = [];
  const searchExclude = []; //{match:{"chromosome":"chrX"}},{terms:{"type.keyword":['Gain','Loss','CN-LOH','Undetermined']}}
  let hasX = false;
  let hasY = false;
  const datasets = [];
  //if there is more studies, queryString is an array, if there is only one, study is json object
  qdataset.length
    ? qdataset.forEach((element) => {
        element.value === "X" ? (hasX = true) : "";
        element.value === "Y" ? (hasY = true) : "";
        element.label ? datasets.push(element.value) : "";
        //element.label?searchdataset.push({match:{dataset:element.value}}):''
      })
    : datasets.push(qdataset.value);
  searchdataset.push({ terms: { dataset: datasets } });
  let sexarr = [];
  if (qsex.length > 0) {
    qsex.forEach((e) => {
      e.value === "male" ? sexarr.push("M") : "";
      e.value === "female" ? sexarr.push("F") : "";
    });
    console.log(sexarr);
    searchdataset.push({ terms: { "expectedSex.keyword": sexarr } });
  }
  //searchdataset.push({ terms: { "expectedSex.keyword": ["F"] } });
  // hasX?searchdataset.push({match:{type:"mLOX"}}):''
  // hasY?searchdataset.push({match:{type:"mLOY"}}):''

  if (!hasX && !hasY) {
    searchExclude.push({ wildcard: { "type.keyword": "mLO*" } });
    searchExclude.push({ match: { chromosome: "chrX" } });
  }
  if (!hasX && hasY) {
    searchExclude.push({ match: { "type.keyword": "mLOX" } });
  }
  if (!hasY && hasX) {
    searchExclude.push({ match: { "type.keyword": "mLOY" } });
  }

  console.log("must", searchdataset, " exlcude: ", searchExclude, " filter: ", filterString);
  const client = new Client({
    node: host,
    auth: {
      username: OPENSEARCH_USERNAME,
      password: OPENSEARCH_PASSWORD,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const result = await client.search({
      index: "mcaexplorer",
      body: {
        track_total_hits: true,
        size: 200000,
        query: {
          bool: {
            must_not: [
              ...searchExclude,
              {
                //in ukbb data, there is chrX with all other types, and will exclude them
                bool: {
                  filter: [
                    {
                      match: {
                        chromosome: "chrX",
                      },
                    },
                    {
                      terms: {
                        "type.keyword": ["Gain", "Loss", "CN-LOH", "Undetermined"],
                      },
                    },
                  ],
                },
              },
            ],
            must: searchdataset,
            filter: filterString,
          },
        },
      },
    });
    console.log(result.body.hits.hits.length);
    response.json(result.body.hits.hits);
  } catch (error) {
    console.error(error);
  }
});

apiRouter.post("/opensearch/gene", async (request, response) => {
  const { logger } = request.app.locals;
  // var client = new Client({
  //   node: host,
  //   ssl: {
  //     rejectUnauthorized: false
  //   }
  // })
  const search = request.body.search;
  const xMax = search.xMax;
  const xMin = search.xMin;
  const chr = search.chr;
  //console.log(search, xMax,chr)
  const client = new Client({
    node: host,
    auth: {
      username: OPENSEARCH_USERNAME,
      password: OPENSEARCH_PASSWORD,
    },
    ssl: {
      rejectUnauthorized: false,
    },

    //  node: host,
    //   ssl: {
    //     rejectUnauthorized: false
    //   }
  });
  //console.log(client)
  try {
    const result = await client.search({
      index: "combinedgene", //new_geneindex is convert position as number
      body: {
        track_total_hits: true,
        size: 10000,
        query: {
          bool: {
            filter: [
              {
                range: {
                  transcriptionStart: {
                    gt: xMin,
                  },
                },
              },
              {
                range: {
                  transcriptionEnd: {
                    lt: xMax,
                  },
                },
              },
            ],
            must: [
              {
                match: {
                  chromosome: chr,
                },
              },
            ],
          },
        },
      },
    });
    console.log(result.body.hits.hits.length);
    response.json(result.body.hits.hits);
  } catch (error) {
    console.error(error);
  }
});

apiRouter.post("/opensearch/chromosome", async (request, response) => {
  const { logger } = request.app.locals;
  const search = request.body.search;
  const dataset = [];
  const queryString = [];
  search.forEach((element) => {
    //element.label?dataset.push(element.value):''
    element.label ? dataset.push(element.value) : "";
    element.chr ? queryString.push({ match: { chromosome: "chr" + element.chr } }) : "";
  });
  queryString.push({ terms: { dataset: dataset } });
  //console.log(queryString)
  const client = new Client({
    node: host,
    auth: {
      username: OPENSEARCH_USERNAME,
      password: OPENSEARCH_PASSWORD,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const result = await client.search({
      index: "mcaexplorer",
      body: {
        track_total_hits: true,
        size: 200000,
        query: {
          bool: {
            must: queryString,
          },
        },
      },
    });
    console.log(result.body.hits.hits.length);
    response.json(result.body.hits.hits);
  } catch (error) {
    console.error(error);
  }
});
