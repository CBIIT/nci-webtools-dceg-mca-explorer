const fs = require("fs");
const fsp = require("fs/promises");
const readline = require("readline");

const { Client } = require("@opensearch-project/opensearch");
const { ADMIN, PASSWORD, DOMAIN } = process.env;
const host = `https://${ADMIN}:${PASSWORD}@${DOMAIN}`;

const client = new Client({
  node: host,
  ssl: {
    rejectUnauthorized: false,
  },
});

const sources = [
  { path: "data/plcoAuto.json", index: "mcaExplorer" },
  { path: "data/plcoDenominator.json", index: "mcaExplorer" },
  { path: "data/plcomLOX.json", index: "mcaExplorer" },
  { path: "data/plxomLOY.json", index: "mcaExplorer" },
  { path: "data/ukbbAuto.json", index: "mcaExplorer" },
  { path: "data/ukbbmLOX.json", index: "mcaExplorer" },
  { path: "data/ukbbmLOY.json", index: "mcaExplorer" },
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
      let contents = JSON.parse(line);
      if (!contents.index) {
        datasource.push({ id, ...contents });
        id++;
      }
    }

    logger.info(`Read ${datasource.length} documents, starting import.`);

    const result = await client.helpers.bulk({
      datasource,
      onDocument(doc) {
        return {
          index: { _index: source.index, _id: doc.id },
        };
      },
    });

    logger.info(result);
    logger.info(`Imported ${source.index}`);
  }
}
