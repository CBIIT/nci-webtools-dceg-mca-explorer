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
  // { path: "data/combined_gene.json", index: "combinedgene" },
  { path: "/Users/yaox5/desktop/dbsnp2.csv", index: "dbsnp" },
  //{ path: "data/test.json", index: "test" },
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
    let p = 0;
    let temp = "";
    const bid = 0; //10000000;
    const times = Number(args[2]);
    const importNum = 50000000;
    const endbid = importNum * times;
    let tid = times * importNum;
    let lid = 0;
    for await (const line of reader) {
      if (lid >= endbid * 3) {
        if (p === 1) {
          temp = "{" + temp + line.replace("chromosome", "chr");
        } else if (p === 2) {
          temp = temp + line.replace("position_grch38", "grch38") + "}";
        } else if (p === 3) {
          p = 0;
          let contents = JSON.parse(temp);
          contents.grch38 = Number(contents.grch38);
          const id = tid + "";
          datasource.push({ id, ...contents });
          temp = [];
          tid++;
        }
        p++;
      }

      // if (id % 100000 == 0) console.log(id);
      if (tid >= importNum * (times + 1)) {
        break;
      }
      lid++;
      // {
      //   const t = "{" + temp[0] + "}";
      //   let contents = JSON.parse(t);
      //   if (!contents.index) {
      //     datasource.push({ id, ...contents });
      //     //
      //     console.log(contents);
      //     //id++;
      //   }
      //   datasource.push({ id, ...temp[0] });
      // }
      // id++;
      // if (id > 100) {
      //   break;
      // }
    }
    //console.log(datasource);
    // logger.info(`Read ${datasource.length} documents, starting import.`);
    // const result = await client.helpers.bulk({
    //   datasource,
    //   onDocument(doc) {
    //     return {
    //       index: { _index: source.index, _id: source.id },
    //     };
    //   },
    // });
    // logger.info(result);
    // logger.info(`Imported ${source.index}`);
  }
}
