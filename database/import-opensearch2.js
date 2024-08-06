import fs from "fs";
import readline from "readline";

import { Client } from "@opensearch-project/opensearch";

const { ADMIN, PASSWORD, DOMAIN } = process.env;
//console.log(process.env)
const host = `https://${ADMIN}:${PASSWORD}@${DOMAIN}`;
//const host =`http://admin:admin@localhost:9200`

const client = new Client({
  node: host,
  ssl: {
    rejectUnauthorized: false,
  },
});
const args = process.argv;
console.log(args[2]);
const sources = [
  // { path: "data/plcoAuto.json", index: "mcaexplorer" },
  // { path: "data/plcoDenominator.json", index: "mcaexplorer" },
  // { path: "data/plcomLOX.json", index: "mcaexplorer" },
  // { path: "data/plcomLOY.json", index: "mcaexplorer" },
  // { path: "data/ukbbAuto.json", index: "mcaexplorer" },
  // { path: "data/ukbbmLOX.json", index: "mcaexplorer" },
  // { path: "data/ukbbmLOY.json", index: "mcaexplorer" },
  // { path: "data/combined_gene_test.json", index: "combinedgene_test" },
  // { path: "data/snp_test2.csv", index: "snpchip" },
  { path: "/Users/yaox5/Downloads/snp-platforms/snp_col.csv", index: "snpchip" },
];

runImport(client, sources)
  .catch(console.error)
  .finally(() => {
    client.close();
    process.exit();
  });

async function runImport(client, sources, logger = console) {
  for (const source of sources) {
    logger.info(`Importing ${source.path} into ${source.index}`);

    const datasource = [];
    const reader = readline.createInterface({
      input: fs.createReadStream(source.path),
    });

    let id = 0;
    let times = Number(args[2]); //node import-opensearch2.js 0/1... around 10 to finish loading
    let numbers = 1000000;
    let beginid = times * numbers;
    let endid = (times + 1) * numbers;
    for await (const line of reader) {
      if (id > beginid) {
        let d = line.split(",");
        //let contents = "{chr:" + d[0] + ",grch38:" + d[1] + "}";
        let p1 = line.indexOf("[");
        let p2 = line.indexOf("]");
        const platform = line.substring(p1 + 1, p2);
        const platforms = platform.split(",");
        const temp = [];
        platforms.forEach((element) => {
          const correctedEle = element.replace(/""/g, '"');
          const p = JSON.parse(correctedEle);
          temp.push(p.platform);
        });
        datasource.push({ id, chr37: d[0], chr38: d[1], grch37: Number(d[2]), grch38: Number(d[3]), platforms: temp });
        if (id % 5000000 == 0) console.log(id);
      }
      id++;
      if (id > endid) break;
    }
    //console.log(datasource.length);
    logger.info(`Read ${datasource.length} documents, starting import.`);

    const result = await client.helpers.bulk({
      datasource,
      onDocument(doc) {
        return {
          index: { _index: source.index, _id: source.id },
        };
      },
    });

    logger.info(result);
    logger.info(`Imported ${source.index}`);
  }
}
