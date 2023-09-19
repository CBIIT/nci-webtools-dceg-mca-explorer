import express, { response } from "express";
import Router from "express-promise-router";
import { getStatus, getSamples } from "./query.js";
import cors from "cors";
import { Client } from "@opensearch-project/opensearch";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const spec = require("./spec.json");
const { APPLICATION_NAME, BASE_URL, OPENSEARCH_USERNAME, OPENSEARCH_PASSWORD, OPENSEARCH_ENDPOINT } = process.env;

export const apiRouter = new Router();

apiRouter.use(cors());
apiRouter.use(express.json());

//const host = `https://${OPENSEARCH_USERNAME}:${OPENSEARCH_PASSWORD}@${OPENSEARCH_ENDPOINT}`;
const host = `https://${OPENSEARCH_ENDPOINT}`;

//console.log("opensearch host is:", host);

// log requests
apiRouter.use((request, response, next) => {
  const { logger } = request.app.locals;
  request.startTime = new Date().getTime();
  logger.info([request.path, request.query]);
  next();
});

// add cache-control headers to responses for GET requests
apiRouter.use((request, response, next) => {
  if (request.method === "GET") response.set("Cache-Control", `public, max-age=${60 * 60}`);
  next();
});

// add cors headers to responses
apiRouter.use((request, response, next) => {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "*");
  response.set("Access-Control-Allow-Headers", "*");
  response.set("Access-Control-Allow-Credentials", "true");
  next();
});

apiRouter.get("/", (request, response) => {
  spec.servers = [{ url: BASE_URL || "." }];
  //spec.servers = [{ url: "localhost" || "." }];
  response.json(spec);
});

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
  const qmincf = request.body.mincf ? request.body.mincf : 0;
  const qmaxcf = request.body.maxcf ? request.body.maxcf : 1;
  const qancestry = request.body.ancestry;
  const qtype = request.body.types;
  const qchromosomes = request.body.chromosomes;
  const qstart = request.body.start ? Number(request.body.start) : 0;
  const qend = request.body.end ? Number(request.body.end) : 9999999999;
  console.log(qdataset, qsex, qmincf, qmaxcf, qancestry, qmaxcf, qmincf, qtype, qstart, qend);
  let qfilter = ["Gain", "Loss", "CN-LOH", "Undetermined", "mLOX", "mLOY"];
  if (qtype !== undefined) {
    if (qtype.find((option) => option.value === "all") === undefined) {
      qfilter = ["mLOX", "mLOY"];
      qtype.forEach((t) => qfilter.push(t.label));
    }
  }

  //serach only rows which has chromosome, this will exclude plcoDenominator
  const filterString = [{ terms: { "type.keyword": qfilter } }];
  const searchdataset = [];
  const searchExclude = []; //{match:{"chromosome":"chrX"}},{terms:{"type.keyword":['Gain','Loss','CN-LOH','Undetermined']}}
  let hasX = false;
  let hasY = false;
  const datasets = [];
  //if there is more studies, queryString is an array, if there is only one, study is json object
  if (qdataset !== undefined) {
    qdataset.length
      ? qdataset.forEach((element) => {
          element.value === "X" ? (hasX = true) : "";
          element.value === "Y" ? (hasY = true) : "";
          element.label ? datasets.push(element.value) : "";
          //element.label?searchdataset.push({match:{dataset:element.value}}):''
        })
      : datasets.push(qdataset.value);
    searchdataset.push({ terms: { dataset: datasets } });
  }
  //if query for chromosome
  if (qchromosomes !== undefined && qchromosomes !== null) {
    console.log(qchromosomes);
    let chrarr = [];
    chrarr.push(qchromosomes.value);
    searchdataset.push({ terms: { "chromosome.keyword": chrarr } });
  }
  //query sex
  let sexarr = [];
  if (qsex !== undefined && qsex.length > 0) {
    qsex.forEach((e) => {
      e.value === "male" ? sexarr.push("M") : "";
      e.value === "female" ? sexarr.push("F") : "";
    });
    console.log(sexarr);
    searchdataset.push({ terms: { "computedGender.keyword": sexarr } });
  }
  //query cf within the range, add query range in filter
  if (qmincf !== undefined || qmaxcf !== undefined) {
    if (qmincf === undefined) qmincf = "0";
    if (qmaxcf === undefined) qmaxcf = "1";
    filterString.push({ range: { cf: { gte: qmincf, lte: qmaxcf } } });
  }

  //query ancestry
  let ancestryarr = [];
  if (qancestry !== undefined && qancestry.length > 0) {
    qancestry.forEach((a) => {
      ancestryarr.push(a.value);
    });
    searchdataset.push({ terms: { "ancestry.keyword": ancestryarr } });
  }

  if (qstart !== undefined) {
    filterString.push({
      range: {
        beginGrch38: {
          gte: qstart,
        },
      },
    });
  }
  if (qend !== undefined) {
    filterString.push({
      range: {
        endGrch38: {
          lte: qend,
        },
      },
    });
  }

  //searchdataset.push({ terms: { "expectedSex.keyword": ["F"] } });
  // hasX?searchdataset.push({match:{type:"mLOX"}}):''
  // hasY?searchdataset.push({match:{type:"mLOY"}}):''

  if (!hasX && !hasY) {
    searchExclude.push({ wildcard: { "type.keyword": "mLO*" } });
    searchExclude.push({ match: { chromosome: "chrX" } });
  }
  if (!hasX && hasY) {
    searchExclude.push({ match: { "type_.keyword": "mLOX" } });
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
      index: "mcaexplorer_index",
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
  const group = request.body;
  if (group != undefined) {
    console.log("query group:", group);
    const study = group.study;
    const array = group.array;
    const chromesome = group.chr;
    const sex = group.sex;
    const ancestry = group.ancestry;
    const maxAge = group.maxAge;
    const minAge = group.minAge;
    const maxcf = group.maxFraction;
    const mincf = group.minFraction;
    const types = group.types;
    const start = group.start ? Number(group.start) : 0;
    const end = group.end ? Number(group.end) : 9999999999;
    //console.log("query string:", study, array, chromesome);
    const dataset = [];
    const queryString = [];
    let qfilter = ["Gain", "Loss", "CN-LOH", "Undetermined", "mLOX", "mLOY"];
    //serach only rows which has chromosome, this will exclude plcoDenominator
    //queryString.push({ terms: { "type.keyword": qfilter } });
    if (chromesome === "Y") {
      queryString.push({ match: { "type.keyword": "mLOY" } });
      queryString.push({ match: { chromosome: "chrX" } });
    } else if (chromesome === "X") {
      queryString.push({ match: { chromosome: "chrX" } });
      queryString.push({ match: { "type.keyword": "mLOX" } });
    } else queryString.push({ match: { chromosome: "chr" + chromesome } });

    if (study !== undefined && study.length > 0) queryString.push({ terms: { dataset: parseQueryStr(study) } });
    //if (array !== undefined) queryString.push({ terms: { array: parseQueryStr(array) } });
    if (sex !== undefined && sex.length > 0)
      queryString.push({ terms: { "computedGender.keyword": parseQueryStr(sex) } });
    //add query for ancestry
    let atemp = [];
    if (ancestry !== undefined) {
      ancestry.forEach((a) => {
        atemp.push(a.value);
      });
      queryString.push({ terms: { "ancestry.keyword": atemp } });
    }
    atemp = [];
    //add query for types
    if (types !== undefined) {
      types.forEach((t) => {
        atemp.push(t.label);
      });
      queryString.push({ terms: { "type.keyword": atemp } });
    }
    //add query for cf
    //query cf within the range, add query range in filter
    if (mincf !== undefined || maxcf !== undefined) {
      if (mincf === undefined) mincf = "0";
      if (maxcf === undefined) maxcf = "1";

      queryString.push({ range: { cf: { gte: mincf, lte: maxcf } } });
    }

    //console.log(chromesome, queryString);
    // const searchExclude = [];
    // if (chromesome === "Y") {
    //   //searchExclude.push({ match: { "type.keyword": "mLOX" } });
    // }
    // if (chromesome === "X") {
    //   searchExclude.push({ match: { "type.keyword": "mLOY" } });
    // }
    // console.log(chromesome, queryString, searchExclude);
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
        index: "mcaexplorer_index", //this index change beginGrch38 and endGrch38 as long type
        body: {
          track_total_hits: true,
          size: 200000,
          query: {
            bool: {
              filter: [
                {
                  range: {
                    beginGrch38: {
                      gte: start,
                    },
                  },
                },
                {
                  range: {
                    endGrch38: {
                      lte: end,
                    },
                  },
                },
              ],
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
  const bins = search.bins;
  //console.log(search, xMax, xMin, chr, bins);
  let ranges = [];
  let binSize = (xMax - xMin) / bins;
  for (let i = xMin; i <= xMax; i += binSize) {
    ranges.push({ from: i, to: i + binSize });
  }
  //console.log(ranges);

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
        size: 0,
        query: {
          bool: {
            must: [
              {
                match: {
                  chr38: chr,
                },
              },
            ],
          },
        },
        aggs: {
          number_of_grch38_distribution: {
            range: {
              field: "grch38",
              ranges: ranges,
            },
          },
        },
      },
    });
    console.log(result.body.aggregations.number_of_grch38_distribution.buckets.length);
    response.json(result.body.aggregations.number_of_grch38_distribution.buckets);
  } catch (error) {
    console.error(error);
  }
});
