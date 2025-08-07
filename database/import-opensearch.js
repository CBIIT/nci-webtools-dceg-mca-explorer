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
  requestTimeout: 2400000,
});
const sources = [
  //{ path: "data/plcoAuto.json", index: "mcaexplorer" },
  //{ path: "data/plcoDenominator.json", index: "denominator" },
 // { path: "data/plcomLOX.json", index: "mcaexplorer" },
 //  { path: "data/plcomLOY.json", index: "mcaexplorer" },
 //  { path: "data/ukbbAuto.json", index: "mcaexplorer" },
 //  { path: "data/ukbbmLOX.json", index: "mcaexplorer" },
 //  { path: "data/ukbbmLOY.json", index: "mcaexplorer" },
 // { path: "data/ukbbdenominator.json", index: "denominator" },
  { path: "data/biovudenominator.json", index: "denominator" },
  // { path: "data/biovuAuto.json", index: "mcaexplorer" },
  // { path: "data/biovumLOX.json", index: "mcaexplorer" },
  // { path: "data/biovumLOY.json", index: "mcaexplorer" },
];
runImport(client, sources)
  .then((totalImported) => {
    console.log(`\n=== IMPORT COMPLETE ===`);
    console.log(`Total documents imported: ${totalImported}`);
  })
  .catch(console.error)
  .finally(() => {
    client.close();
    process.exit();
  });
let total = 0;
async function runImport(client, sources, logger = console) {
  let totalImported = 0;
  for (const source of sources) {
    logger.info(`Importing ${source.path} into ${source.index}`);
    const datasource = [];
    const reader = readline.createInterface({
      input: fs.createReadStream(source.path),
    });

    for await (const line of reader) {
      datasource.push(line);
      if (datasource.length >= BATCH_SIZE * 2) {
        // Each document consists of 2 lines
        const imported = await importBatch(client, source.index, datasource, logger);
        totalImported += imported;
        datasource.length = 0; // Clear the array
      }
    }

    // Import any remaining documents
    if (datasource.length > 0) {
      const imported = await importBatch(client, source.index, datasource, logger);
      totalImported += imported;
    }
  }
  
  logger.info(`Total documents imported: ${totalImported}`);
  return totalImported;
}

async function importBatch(client, index, datasource, logger) {
  const documentsCount = datasource.length / 2;
  // logger.info(`Importing batch of ${documentsCount} documents.`);
  try {
    const response = await client.bulk({
      body: datasource,
      timeout: "5m", // Increase bulk request timeout to 5 minutes
    });
    logger.info(`Successfully imported batch of ${documentsCount} documents.`);
    return documentsCount;
  } catch (error) {
    logger.error(`Error importing batch: ${error}`);
    return 0;
  }
}

async function getDocumentCount(client, index) {
  try {
    const response = await client.count({
      index: index,
    });
    return response.body.count;
  } catch (error) {
    console.error(`Error getting document count for index ${index}:`, error);
    throw error;
  }
}

const BATCH_SIZE = 1000; // Define a batch size

// async function runImport(client, sources, logger = console) {
//   for (const source of sources) {
//     logger.info(`Importing ${source.path} into ${source.index}`);
//     const datasource = [];
//     const reader = readline.createInterface({
//       input: fs.createReadStream(source.path),
//     });
//     let id = 0;
//     for await (const line of reader) {
//       // console.log(line);
//       let contents = JSON.parse(line);
//       if (!contents.index) {
//         datasource.push({ id, ...contents });
//         id++;
//         // console.log(id);
//       }
//     }
//     //console.log(datasource.length);
//     logger.info(`Read ${datasource.length} documents, starting import.`);
//     const result = await client.helpers.bulk({
//       datasource,
//       onDocument(doc) {
//         return {
//           index: { _index: source.index, _id: source.id },
//         };
//       },
//     });
//     logger.info(result);
//     logger.info(`Imported ${source.index}`);
//   }
// }
