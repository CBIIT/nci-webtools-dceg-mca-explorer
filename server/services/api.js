import express, { response } from "express";
import Router from "express-promise-router";
import { getStatus, getSamples, AncestryOptions } from "./query.js";
import cors from "cors";
import { Client } from "@opensearch-project/opensearch";
import { createRequire } from "module";
import { exec } from "child_process";
import { stderr } from "process";
const require = createRequire(import.meta.url);
const spec = require("./spec.json");
const { APPLICATION_NAME, BASE_URL, OPENSEARCH_USERNAME, OPENSEARCH_PASSWORD, OPENSEARCH_ENDPOINT } = process.env;
//import  { AncestryOptions }  from "../../client/src/modules/mosaicTiler/constants.js";
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
  const qdataset = request.body.study;
  const qsex = request.body.sex;
  let qmincf = request.body.mincf ? Number(request.body.mincf) / 100.0 : NaN;
  let qmaxcf = request.body.maxcf ? Number(request.body.maxcf) / 100.0 : NaN;
  // console.log(qmincf, qmaxcf);
  const qancestry = request.body.ancestry;
  const qtype = request.body.types;
  const qchromosomes = request.body.chromosomes;
  const qstart = request.body.start ? Number(request.body.start) : 0;
  const qend = request.body.end ? Number(request.body.end) : 9999999999;
  const qsmokeNFC = request.body.smoking;
  const qplatform = request.body.array;
  const minAge = request.body.minAge ? Number(request.body.minAge) : 0;
  const maxAge = request.body.maxAge ? Number(request.body.maxAge) : 100;

  const qpriorCancer = request.body.priorCancer;
  const qhemaCancer = request.body.hemaCancer;
  const qlymCancer = request.body.lymCancer;
  const qmyeCancer = request.body.myeCancer;
  // console.log(qsex);
  //console.log(minAge,maxAge)
  console.log(
    qdataset,
    qsex,
    qmincf,
    qmaxcf,
    qmaxcf === "NaN",
    qancestry,
    qtype,
    qstart,
    qend,
    qchromosomes,
    minAge,
    maxAge
  );

  let qfilter = [];
  if (qtype !== undefined) {
    qtype.forEach((qt) => {
      if (qt.value != "all") {
        qfilter.push(qt.label);
      }
    });
  }
  if (qfilter.length === 0) {
    qfilter = ["Gain", "Loss", "CN-LOH", "Undetermined"];
  }

  //serach only rows which has chromosome, this will exclude plcoDenominator
  const filterString = [];
  const searchdataset = [];
  const searchExclude = []; //{match:{"chromosome":"chrX"}},{terms:{"type.keyword":['Gain','Loss','CN-LOH','Undetermined']}}
  //if there is more studies, queryString is an array, if there is only one, study is json object
  if (qdataset !== undefined) {
    const { datasets, filterlist } = getStudy(qdataset, qfilter);
    searchdataset.push({ terms: { dataset: datasets } });
    qfilter = filterlist;
  }

  //if query for chromosome
  if (qchromosomes !== undefined && qchromosomes !== null) {
    // console.log(qchromosomes);
    let chrarr = [];
    chrarr.push(qchromosomes.value);
    if (qchromosomes.value !== "chrX" && qchromosomes.value !== "chrY")
      searchdataset.push({ terms: { "chromosome.keyword": chrarr } });
    else {
      qfilter = qchromosomes.value === "chrX" ? ["mLOX"] : ["mLOY"];
    }
  }
  console.log("for checking: ", qfilter, searchdataset);
  //query sex
  let sexarr = getAttributesArray(qsex, "sex");

  //query cf within the range, add query range in filter
  if (!Number.isNaN(qmincf) || !Number.isNaN(qmaxcf)) {
    if (Number.isNaN(qmincf)) qmincf = "0";
    if (Number.isNaN(qmaxcf)) qmaxcf = "1";
    filterString.push({ range: { cf: { gte: qmincf, lte: qmaxcf } } });
  }

  //query ancestry
  let ancestryarr = getAttributesArray(qancestry, "ancestry");
  let smokearr = getAttributesArray(qsmokeNFC, "smoking");
  let platformarr = getAttributesArray(qplatform, "array");
  let priorCancerarr = getAttributesArray(qpriorCancer, "priorcancer");
  let hemaCancerarr = getAttributesArray(qhemaCancer, "hemacancer");
  let lymCancerarr = getAttributesArray(qlymCancer, "lymcancer");
  let myeCancerarr = getAttributesArray(qmyeCancer, "myecancer");

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
  // ancestryarr.length > 0 ? filterString.push({ terms: { "ancestry.keyword": ancestryarr } }) : "";
  filterString.push({ terms: { "type.keyword": qfilter } });
  console.log("must", searchdataset, " exlcude: ", searchExclude, " filter: ", filterString, qfilter, qstart, qend);

  try {
    const result = await client.search({
      index: "mcaexplorer_index",
      body: {
        track_total_hits: true,
        size: 200000,
        query: {
          bool: {
            must_not: [...searchExclude],
            must: searchdataset,
            filter: filterString,
          },
        },
      },
    });

    console.log(result.body.hits.hits.length);

    const resultsIds = result.body.hits.hits.map((item) => item._source.sampleId);
    //console.log(resultsIds.length, sexarr, ancestryarr, smokearr, platformarr,minAge,maxAge,priorCancerarr);
    try {
      const resultdemo = await client.search({
        index: "denominator_age",
        _source: [
          "sampleId",
          "age",
          "sex",
          "smokeNFC",
          "PopID",
          "array",
          "priorCancer",
          "incidentCancerHem",
          "incidentCancerLymphoid",
          "incidentCancerMyeloid",
        ],
        body: {
          track_total_hits: true,
          size: 200000,
          query: {
            bool: {
              must: [
                {
                  terms: {
                    sampleId: resultsIds,
                  },
                },
                {
                  terms: {
                    "sex.keyword": sexarr,
                  },
                },
                {
                  terms: {
                    PopID: ancestryarr,
                  },
                },
                {
                  terms: {
                    smokeNFC: smokearr,
                  },
                },
                {
                  terms: {
                    "array.keyword": platformarr,
                  },
                },
                {
                  terms: {
                    priorCancer: priorCancerarr,
                  },
                },
                {
                  terms: {
                    incidentCancerHem: hemaCancerarr,
                  },
                },
                {
                  terms: {
                    incidentCancerLymphoid: lymCancerarr,
                  },
                },
                {
                  terms: {
                    incidentCancerMyeloid: myeCancerarr,
                  },
                },
              ],
              filter: [
                {
                  range: { age: { gte: minAge, lte: maxAge } },
                },
              ],
            },
          },
        },
      });
      console.log(resultdemo.body.hits.hits.length, result.body.hits.hits.length);

      //merge two results based on denominatore reulsts
      const mergedResult = { nominator: result.body.hits.hits, denominator: resultdemo.body.hits.hits };

      response.json(mergedResult);
      //response.json(result.body.hits.hits);
    } catch (error) {
      console.error(error);
    }
    ////
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
    //(result.body.hits.hits.length);
    response.json(result.body.hits.hits);
  } catch (error) {
    console.error(error);
  }
});

apiRouter.post("/opensearch/chromosome", async (request, response) => {
  const { logger } = request.app.locals;
  const group = request.body;
  if (group != undefined) {
    //console.log("query group:", group.maxAge);
    const study = group.study;
    const platfomrarray = group.array;
    const chromesome = group.chr;
    const sex = group.sex;
    const ancestry = group.ancestry;
    const maxAge = group.maxAge !== undefined ? Number(group.maxAge) : 100;
    const minAge = group.minAge !== undefined ? Number(group.minAge) : 0;
    let maxcf = Number(group.maxcf) / 100.0;
    let mincf = Number(group.mincf) / 100.0;
    const types = group.types;
    const start = group.start ? Number(group.start) : 0;
    const end = group.end ? Number(group.end) : 9999999999;
    const smokeNFC = group.smoking;
    const priorCancer = group.priorCancer;
    const hemaCancer = group.hemaCancer;
    const lymCancer = group.lymCancer;
    const myeCancer = group.myeCancer;

    console.log("query string:", study, platfomrarray, sex, ancestry, smokeNFC, chromesome, minAge, maxAge);
    const dataset = [];
    const queryString = [];
    let qfilter = ["Gain", "Loss", "CN-LOH", "Undetermined", "mLOX", "mLOY"];
    //serach only rows which has chromosome, this will exclude plcoDenominator
    //queryString.push({ terms: { "type.keyword": qfilter } });
    if (chromesome === "Y") {
      queryString.push({ terms: { "type.keyword": ["mLOY"] } });
      queryString.push({ match: { "chromosome.keyword": "chrX" } });
    } else if (chromesome === "X") {
      queryString.push({ match: { "chromosome.keyword": "chrX" } });
      queryString.push({ terms: { "type.keyword": ["mLOX"] } });
    } else queryString.push({ match: { chromosome: "chr" + chromesome } });

    if (study !== undefined && study.length > 0)
      queryString.push({ terms: { dataset: parseQueryStr("study", study) } });

    let sexarr = getAttributesArray(sex, "sex");
    // console.log(sexarr);
    //add query for ancestry
    let ancestryarry = getAttributesArray(ancestry, "ancestry");
    //console.log(ancestryarry);
    let smokearr = getAttributesArray(smokeNFC, "smoking");
    let platformarr = getAttributesArray(platfomrarray, "array");
    let priorCancerarr = getAttributesArray(priorCancer, "priorcancer");
    let hemaCancerarr = getAttributesArray(hemaCancer, "hemacancer");
    let lymCancerarr = getAttributesArray(lymCancer, "lymcancer");
    let myeCancerarr = getAttributesArray(myeCancer, "myecancer");

    // console.log(myeCancerarr,priorCancerarr)
    let atemp = [];
    //add query for types
    if (types !== undefined) {
      types.forEach((t) => {
        if (t.value !== "all") atemp.push(t.label);
        else if (t.value === "all") atemp = ["Gain", "Loss", "CN-LOH", "Undetermined", "mLOX", "mLOY"];
      });
    }
    if (chromesome !== "X" && chromesome !== "Y") {
      if (atemp.length > 0) queryString.push({ terms: { "type.keyword": atemp } });
      else atemp = ["Gain", "Loss", "CN-LOH", "Undetermined"];
    }

    //add query for cf
    //query cf within the range, add query range in filter
    if (!Number.isNaN(mincf) || !Number.isNaN(maxcf)) {
      if (Number.isNaN(mincf)) mincf = "0";
      if (Number.isNaN(maxcf)) maxcf = "1";
      queryString.push({ range: { cf: { gte: mincf, lte: maxcf } } });
    }
    console.log(queryString);
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
      //  console.log(queryString);
      const resultsIds = result.body.hits.hits.map((item) => item._source.sampleId);

      try {
        const resultdemo = await client.search({
          index: "denominator_age",
          _source: [
            "sampleId",
            "age",
            "sex",
            "smokeNFC",
            "PopID",
            "array",
            "priorCancer",
            "incidentCancerHem",
            "incidentCancerLymphoid",
            "incidentCancerMyeloid",
          ],
          body: {
            track_total_hits: true,
            size: 200000,
            query: {
              bool: {
                must: [
                  {
                    terms: {
                      sampleId: resultsIds,
                    },
                  },
                  {
                    terms: {
                      "sex.keyword": sexarr,
                    },
                  },
                  {
                    terms: {
                      PopID: ancestryarry,
                    },
                  },
                  {
                    terms: {
                      smokeNFC: smokearr,
                    },
                  },
                  {
                    terms: {
                      "array.keyword": platformarr,
                    },
                  },
                  {
                    terms: {
                      priorCancer: priorCancerarr,
                    },
                  },
                  {
                    terms: {
                      incidentCancerHem: hemaCancerarr,
                    },
                  },
                  {
                    terms: {
                      incidentCancerLymphoid: lymCancerarr,
                    },
                  },
                  {
                    terms: {
                      incidentCancerMyeloid: myeCancerarr,
                    },
                  },
                ],
                filter: [
                  {
                    range: { age: { gte: minAge, lte: maxAge } },
                  },
                ],
              },
            },
          },
        });
        console.log("denominator", resultdemo.body.hits.hits.length, "nominator:", result.body.hits.hits.length);

        const mergedResult = { nominator: result.body.hits.hits, denominator: resultdemo.body.hits.hits };

        response.json(mergedResult);
        //response.json(result.body.hits.hits);
      } catch (error) {
        console.error(error);
      }

      //console.log(result.body.hits.hits.length);
      //response.json(result.body.hits.hits);
    } catch (error) {
      console.error(error);
    }
  }
});

const parseQueryStr = (name, query) => {
  // query.forEach((e) => {
  //   e.value === "male" ? sexarr.push("M") : "";
  //   e.value === "female" ? sexarr.push("F") : "";
  // });
  const values = [];
  query.forEach((e) => {
    if (e.value === "male" || e.value === "female") {
      values.push(e.value.substring(0, 1).toUpperCase());
    } else values.push(e.value);
    if (e.value === "all") {
      if (name === "sex") {
        values.push("M");
        values.push("F");
      } else if (name === "ancestry") {
        values.push();
      }
    }
  });
  //console.log(values);
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

  /*const client = new Client({
    node: host,
    auth: {
      username: OPENSEARCH_USERNAME,
      password: OPENSEARCH_PASSWORD,
    },
    ssl: {
      rejectUnauthorized: false,
    },
  });*/
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
    //console.log(result.body.aggregations.number_of_grch38_distribution.buckets.length);
    response.json(result.body.aggregations.number_of_grch38_distribution.buckets);
  } catch (error) {
    console.error(error);
  }
});

apiRouter.post("/opensearch/denominator", async (request, response) => {
  const query = request.body;
  console.log("denominator", query);
  const sex = query.sex;
  const ancestry = query.ancestry;
  const smoking = query.smoking;
  const approach = query.approach;
  const minAge = query.minAge !== undefined ? Number(query.minAge) : 0;
  const maxAge = query.maxAge !== undefined && query.maxAge !== "" ? Number(query.maxAge) : 100;
  const study = query.study;
  const numsize = 0; //only return the denominator total counts, that is used for fisher_test

  let sexarr = getAttributesArray(sex, "sex"),
    ancestryarry = getAttributesArray(ancestry, "ancestry"),
    smokearr = getAttributesArray(smoking, "smoking"),
    platformarr = getAttributesArray(approach, "array"),
    { datasets } = getStudy(study, []);

  console.log(datasets, sexarr, ancestryarry, smokearr, platformarr, minAge, maxAge);
  try {
    const result = await client.search({
      index: "denominator_age",
      _source: ["sampleId"],
      body: {
        track_total_hits: true,
        size: numsize,
        query: {
          bool: {
            must: [
              {
                terms: {
                  dataset: datasets,
                },
              },
              {
                terms: {
                  "sex.keyword": sexarr,
                },
              },
              {
                terms: {
                  PopID: ancestryarry,
                },
              },
              {
                terms: {
                  smokeNFC: smokearr,
                },
              },
              {
                terms: {
                  "array.keyword": platformarr,
                },
              },
            ],
            filter: [
              {
                range: { age: { gte: minAge, lte: maxAge } },
              },
            ],
          },
        },
      },
    });
    console.log(result.body.hits.total.value);
    response.json(result.body.hits.total.value);
  } catch (error) {
    console.error(error);
  }
});

const getAttributesArray = (atti, name) => {
  let attiarray = [];
  if (atti !== undefined && atti !== null) {
    atti.forEach((e) => {
      if (e.value !== "all") {
        attiarray.push(e.value);
      }
    });
  }
  if (attiarray.length === 0) {
    switch (name) {
      case "sex":
        attiarray = ["0", "1", "NA"];
        break;
      case "ancestry":
        AncestryOptions.forEach((a) => (a.value !== "all" ? attiarray.push(a.value) : ""));
        break;
      case "array":
        attiarray = ["Axiom", "BiLEVE", "Illumina Global Screening", "Illumina OncoArray"];
        break;
      case "smoking":
        attiarray = ["0", "1", "2", "9"];
        break;
      default:
        attiarray = ["0", "1"];
    }
  }
  return attiarray;
};
/*
const getSex = (sex) => {
  let sexarr = [];
  if (sex !== undefined && sex !== null) {
    sex.forEach((e) => {
      if (e.value !== "all") {
        sexarr.push(e.value);
      }
    });
  }
  if (sexarr.length === 0) sexarr = ["0", "1"];
  return sexarr;
};

const getAncestry = (ancestry) => {
  let ancestryarry = [];
  if (ancestry !== undefined && ancestry !== null) {
    ancestry.forEach((a) => {
      if (a.value !== "all") {
        ancestryarry.push(a.value);
      }
    });
  }
  if (ancestryarry.length === 0) AncestryOptions.forEach((a) => (a.value !== "all" ? ancestryarry.push(a.value) : ""));
  return ancestryarry;
};

const getPlatform = (platfomrarray) => {
  let platformarr = [];
  if (platfomrarray !== undefined && platfomrarray !== null) {
    platfomrarray.forEach((a) => {
      if (a.value !== "all") {
        platformarr.push(a.value);
      }
    });
  }
  if (platformarr.length === 0) {
    platformarr = ["Axiom", "BiLEVE", "Illumina Global Screening", "Illumina OncoArray"];
  }
  return platformarr;
};

const getSmoking = (smokeNFC) => {
  let smokearr = [];
  if (smokeNFC !== undefined && smokeNFC !== null) {
    smokeNFC.forEach((a) => {
      if (a.value !== "all") {
        smokearr.push(a.value);
      }
    });
  }
  if (smokearr.length === 0) {
    smokearr = ["0", "1", "2"];
  }
  return smokearr;
};*/

const getStudy = (qdataset, qfilter) => {
  const datasets = [];
  //if there is more studies, queryString is an array, if there is only one, study is json object

  if (qdataset !== undefined) {
    qdataset.length
      ? qdataset.forEach((element) => {
          element.value === "X" ? (qfilter = qfilter.concat("mLOX")) : "";
          element.value === "Y" ? (qfilter = qfilter.concat("mLOY")) : "";
          element.label ? datasets.push(element.value) : "";
          //element.label?searchdataset.push({match:{dataset:element.value}}):''
        })
      : datasets.push(qdataset.value);
  }
  const filterlist = qfilter;
  console.log(filterlist);
  return { datasets, filterlist };
};

apiRouter.post("/fishertest", async (request, response) => {
  const matrix = request.body;
  //console.log(matrix);
  const matrixString = matrix.join(" ");
  //console.log(matrixString);
  exec(`Rscript ./services/fisher_test.R ${matrixString}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return response.status(500).send(stderr);
    }
    response.send({ pValue: stdout.trim() });
  });
});
