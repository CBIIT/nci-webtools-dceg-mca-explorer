import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

import { Client } from "@opensearch-project/opensearch";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../server/.env") });

const {
  ADMIN,
  PASSWORD,
  DOMAIN,
  OPENSEARCH_USERNAME,
  OPENSEARCH_PASSWORD,
  OPENSEARCH_ENDPOINT,
  OPENSEARCH_BULK_LINE_BATCH_SIZE,
  OPENSEARCH_BULK_RETRIES,
  OPENSEARCH_BULK_RETRY_DELAY_MS,
} = process.env;
const opensearchEndpoint = OPENSEARCH_ENDPOINT || DOMAIN;
const opensearchUsername = OPENSEARCH_USERNAME || ADMIN;
const opensearchPassword = OPENSEARCH_PASSWORD || PASSWORD;
const bulkLineBatchSize = getEvenPositiveInt(OPENSEARCH_BULK_LINE_BATCH_SIZE, 2000);
const bulkRetries = getPositiveInt(OPENSEARCH_BULK_RETRIES, 6);
const bulkRetryDelayMs = getPositiveInt(OPENSEARCH_BULK_RETRY_DELAY_MS, 5000);

if (!opensearchEndpoint) {
  throw new Error("Missing OPENSEARCH_ENDPOINT in server/.env or DOMAIN in the environment.");
}

const clientOptions = {
  node: `https://${opensearchEndpoint}`,
  ssl: {
    rejectUnauthorized: false,
  },
};

if (opensearchUsername && opensearchPassword) {
  clientOptions.auth = {
    username: opensearchUsername,
    password: opensearchPassword,
  };
}

const client = new Client(clientOptions);
const args = process.argv;
console.log(args[2]);
const sources = [
  { path: "data/all.json" },
];

runImport(client, sources)
  .catch(console.error)
  .finally(() => {
    client.close();
  });

async function runImport(client, sources, logger = console) {
  await assertTargetIndexesExist(client, ["mcaexplorer", "denominator", "merged"], logger);

  for (const source of sources) {
    logger.info(`Importing ${source.path}`);
    const importStats = { attempted: 0, succeeded: 0, failed: 0 };

    const datasource = [];
    const reader = readline.createInterface({
      input: fs.createReadStream(source.path),
    });

    let id = 0;
    let times = Number(args[2]); //node import-opensearch2.js 0/1... around 10 to finish loading
    let numbers = 1000000;
    let beginid = Number.isNaN(times) ? 0 : times * numbers;
    let endid = Number.isNaN(times) ? Infinity : (times + 1) * numbers;
    for await (const line of reader) {
      if (id >= beginid) {
        datasource.push(line);
        if (datasource.length >= bulkLineBatchSize) {
          await importBatch(client, datasource, logger, importStats);
          datasource.length = 0;
        }
      }
      id++;
      if (id >= endid) break;
    }
    if (datasource.length > 0) {
      await importBatch(client, datasource, logger, importStats);
    }

    logger.info(
      `Finished ${source.path}. Attempted ${importStats.attempted} documents; ` +
        `succeeded ${importStats.succeeded}; failed ${importStats.failed}.`
    );

    if (importStats.failed > 0) {
      throw new Error(`Bulk import completed with ${importStats.failed} failed documents.`);
    }
  }
}

async function assertTargetIndexesExist(client, indexNames, logger) {
  const missingIndexes = [];
  for (const indexName of indexNames) {
    try {
      const exists = await client.indices.exists({ index: indexName });
      if (!exists.body) {
        missingIndexes.push(indexName);
      }
    } catch (error) {
      if (error.meta?.statusCode === 403) {
        logger.warn(`Cannot verify index ${indexName}; current user lacks index metadata permission. Continuing import.`);
        continue;
      }
      throw error;
    }
  }

  if (missingIndexes.length > 0) {
    throw new Error(
      `Missing OpenSearch index(es): ${missingIndexes.join(", ")}. Create them with an admin user before importing; ` +
        "the current import user cannot auto-create indexes."
    );
  }
}

async function importBatch(client, datasource, logger, importStats) {
  for (let attempt = 1; attempt <= bulkRetries; attempt++) {
    try {
      const result = await client.bulk({ body: datasource });
      const batchStats = getBulkBatchStats(result.body.items);
      importStats.attempted += batchStats.attempted;
      importStats.succeeded += batchStats.succeeded;
      importStats.failed += batchStats.failed;

      logger.info(
        `Bulk batch: attempted ${batchStats.attempted}; succeeded ${batchStats.succeeded}; failed ${batchStats.failed}.`
      );
      if (result.body?.errors) {
        logBulkItemErrors(result.body.items, logger);
      }
      return result;
    } catch (error) {
      const statusCode = error.meta?.statusCode;
      if (statusCode !== 429 || attempt === bulkRetries) {
        throw error;
      }

      const delayMs = bulkRetryDelayMs * attempt;
      logger.warn(`OpenSearch returned 429. Retrying batch in ${delayMs} ms (${attempt}/${bulkRetries}).`);
      await delay(delayMs);
    }
  }
}

function getBulkBatchStats(items = []) {
  const attempted = items.length;
  const failed = items.filter((item) => {
    const result = item.index || item.create || item.update || item.delete;
    return result?.error;
  }).length;

  return {
    attempted,
    succeeded: attempted - failed,
    failed,
  };
}

function logBulkItemErrors(items = [], logger) {
  const failedItems = items
    .map((item) => item.index || item.create || item.update || item.delete)
    .filter((item) => item?.error);

  logger.warn(`Bulk import completed with ${failedItems.length} item-level errors.`);
  failedItems.slice(0, 5).forEach((item) => {
    logger.warn(
      JSON.stringify({
        index: item._index,
        id: item._id,
        status: item.status,
        errorType: item.error?.type,
        reason: item.error?.reason,
      })
    );
  });
}

function getPositiveInt(value, defaultValue) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : defaultValue;
}

function getEvenPositiveInt(value, defaultValue) {
  const parsed = getPositiveInt(value, defaultValue);
  return parsed % 2 === 0 ? parsed : parsed + 1;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
