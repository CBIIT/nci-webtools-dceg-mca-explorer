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
  if (qsex !== undefined && qsex.length > 0) {
    qsex.forEach((e) => {
      e.value === "male" ? sexarr.push("M") : "";
      e.value === "female" ? sexarr.push("F") : "";
    });
    console.log(sexarr);
    searchdataset.push({ terms: { "computedGender.keyword": sexarr } });
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
  const group = request.body.search;
  if (group != undefined) {
    // console.log("query group:", group);
    const study = group.study;
    const array = group.array;
    const chromesome = group.chr;
    const sex = group.sex;
    const ancestry = group.ancestry;
    const maxAge = group.maxAge;
    const minAge = group.minAge;
    //console.log("query string:", study, array, chromesome);
    const dataset = [];
    const queryString = [];

    queryString.push({ match: { chromosome: "chr" + chromesome } }, { terms: { dataset: parseQueryStr(study) } });
    //if (array !== undefined) queryString.push({ terms: { array: parseQueryStr(array) } });
    if (sex !== undefined && sex.length > 0)
      queryString.push({ terms: { "computedGender.keyword": parseQueryStr(sex) } });
    console.log(queryString);
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
              // [
              //   { match: { chromosome: "chr2" } },
              //   { terms: { dataset: ["plco"] } },
              //   { terms: { "expectedSex.keyword": ["F", "M"] } },
              // ],
            },
          },
        },
      });
      console.log(result.body.hits.hits.length);
      response.json(result.body.hits.hits);
    } catch (error) {
      console.error(error);
    }
  }
});

const parseQueryStr = (query) => {
  // query.forEach((e) => {
  //   e.value === "male" ? sexarr.push("M") : "";
  //   e.value === "female" ? sexarr.push("F") : "";
  // });
  const values = [];
  query.forEach((e) => {
    if (e.value === "male" || e.value === "female") {
      values.push(e.value.substring(0, 1).toUpperCase());
    } else values.push(e.value);
  });
  console.log(values);
  return values;
};

apiRouter.post("/opensearch/snpchip", async (request, response) => {
  const { logger } = request.app.locals;
  const search = request.body.search;
  const xMax = search.xMax;
  const xMin = search.xMin;
  const chr = search.chr;
  console.log(search, xMax, chr);
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
  //console.log(client)
  try {
    const result = await client.search({
      index: "snpchip",
      _source: "grch38",
      body: {
        track_total_hits: true,
        size: 10000,
        query: {
          bool: {
            filter: [
              {
                range: {
                  grch38: {
                    gte: xMin,
                    lte: xMax,
                  },
                },
              },
            ],
            must: [
              {
                match: {
                  chr38: chr,
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
