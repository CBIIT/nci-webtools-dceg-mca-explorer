import { createReadStream } from "fs";
import { basename } from "path";
import { parse } from "csv-parse";
import knex from "knex";

export function createConnection(filename) {
  return knex({
    client: "better-sqlite3",
    connection: { filename },
    useNullAsDefault: true,
  })
}

export async function initializeSchema(connection, schema) {
  const tables = schema.filter(({ type }) => !type || type === "table");

  for (const { name } of [...tables].reverse()) {
    await connection.schema.dropTableIfExists(name);
  }

  for (const { name, schema } of tables) {
    await connection.schema.createTable(name, (table) => schema(table, connection));
  }

  return true;
}

export async function importSources(connection, sources, logger = console) {
  for (const { table, description, sourcePath,  columns, parseConfig } of sources) {
    logger.info(`Importing ${sourcePath} => ${table} (${description})`);
    const readStream = createReadStream(sourcePath);
    const records = await createRecordIterator(sourcePath, readStream, { columns, parseConfig, logger });
    await importTable(connection, records, table, logger);
  }
}

export function getFileMetadataFromPath(filePath) {
  return {
    filename: basename(filePath),
    filepath: filePath,
  };
}

export async function createRecordIterator(sourcePath, inputStream, { columns, parseConfig, logger }) {
  const fileExtension = sourcePath.split(".").pop().toLowerCase();
  const metadata = getFileMetadataFromPath(sourcePath);

  switch (fileExtension) {
    case "csv":
      return createCsvRecordIterator(inputStream, columns, { delimiter: ",", ...parseConfig }, metadata, logger);
    case "txt":
    case "tsv":
      return createCsvRecordIterator(inputStream, columns, { delimiter: "\t", ...parseConfig }, metadata, logger);
    default:
      throw new Error(`Unsupported file extension: ${fileExtension}`);
  }
}


export function createCsvRecordIterator(stream, columns, options = {}, metadata = {}, logger) {
  const parseOptions = {
    columns: true,
    skip_empty_lines: true,
    cast: castValue,
    on_record: createRecordParser(columns, metadata, logger),
    ...options,
  };

  return stream.pipe(parse(parseOptions));
}

export async function importTable(connection, iterable, tableName, logger = console) {
  let count = 0;
  let bufferSize = 500;
  let buffer = [];

  async function flushBuffer() {
    try {
      await connection.batchInsert(tableName, buffer);
      count += buffer.length;
      buffer = [];
      logger.info(`Imported ${count} rows`);
    } catch (error) {
      // batchInsert exceptions do not return the specific records that failed
      // so we need to check each record individually
      for (let record of buffer) {
        try {
          await connection(tableName).insert(record);
        } catch (error) {
          logger.error(record);
          throw error;
        }
      }
      throw error;
    }
  }

  for await (const record of iterable) {
    buffer.push(record);
    if (buffer.length >= bufferSize) {
      await flushBuffer();
    }
  }

  await flushBuffer();
  return count;
}

export function castValue(value) {
  const nullValues = ["", "NA"];
  if (nullValues.includes(value)) {
    return null;
  } else if (!isNaN(value)) {
    return parseFloat(value);
  } else if (typeof value === "number" && isNaN(value)) {
    return null;
  } else {
    return value;
  }
}

export function createRecordParser(columns, metadata, logger = console) {
  return function (record) {
    let row = {};
    for (const { sourceName, sourceMetadataName, name, defaultValue, formatter } of columns) {
      const sourceValue = record[sourceName] ?? defaultValue ?? null;
      const metadataValue = (sourceMetadataName && metadata[sourceMetadataName]) ?? null;
      let value = sourceMetadataName ? metadataValue : sourceValue;

      if (typeof formatter === "function") {
        value = formatter(value, record, name, logger);
      }

      row[name] = value;
    }
    return row;
  };
}
