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
const sources = [
  // { path: "data/plcoAuto.json", index: "mcaexplorer" },
  // { path: "data/plcoDenominator.json", index: "mcaexplorer" },
  // { path: "data/plcomLOX.json", index: "mcaexplorer" },
  // { path: "data/plcomLOY.json", index: "mcaexplorer" },
  // { path: "data/ukbbAuto.json", index: "mcaexplorer" },
  // { path: "data/ukbbmLOX.json", index: "mcaexplorer" },
  // { path: "data/ukbbmLOY.json", index: "mcaexplorer" },
  // { path: "data/combined_gene.json", index: "combinedgene" },
  { path: "data/test.json", index: "snp" },
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
    for await (const line of reader) {
      let temp = line.split("}");
      if (temp.length > 1) {
        const t = "{" + temp[0] + "}";
        let contents = JSON.parse(t);
        if (!contents.index) {
          datasource.push({ id, ...contents });
          id++;
        }
      }
    }
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
