import fs from "fs";
import path from "path";

import { sources } from "./sources_v4.js";

function getSource(filename) {
  return sources.find((e) => e.sourcePath.includes(filename));
}

function applyColumnValue(jsonLine, column, value) {
  jsonLine[column.name] = column.formatter ? column.formatter(value) : value;
}

function applyDefaultColumns(jsonLine, columns) {
  columns
    .filter((column) => column.sourceName === null && column.defaultValue !== undefined)
    .forEach((column) => {
      jsonLine[column.name] = column.defaultValue;
    });
}

function splitRows(raw, delimitter) {
  return delimitter ? raw.split(delimitter) : raw.split(/\r\n|\n|\r/);
}

function normalizeHeaders(headers, source) {
  if (source.parseConfig?.bom && headers.length > 0) {
    headers[0] = headers[0].replace(/^\uFEFF/, "");
  }

  return headers;
}

async function parseFile(filename, delimitter) {
  const filePath = path.resolve("data", filename);

  const source = getSource(filename);
  const columns = source.columns;
  const raw = fs.readFileSync(filePath).toString();
  //console.log(columns);
  const data = splitRows(raw, delimitter);
  const headers = normalizeHeaders(data.shift().split("\t"), source);
  //console.log(headers);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;

    const contentCells = data[i].split("\t");

    var jsonLine = {};
    applyDefaultColumns(jsonLine, columns);
    for (let i = 0; i < contentCells.length; i++) {
      if (!columns.find((e) => e.sourceName === headers[i])) console.log(headers[i]);

      const header = columns.find((e) => e.sourceName === headers[i]);
      //console.log(header);
      applyColumnValue(jsonLine, header, contentCells[i]);
    }

    json.push(jsonLine);
  }

  return json;
}

async function parseCSVFile(filename, delimitter) {
  const filePath = path.resolve("data", filename);

  const source = getSource(filename);
  const columns = source.columns;
  const raw = fs.readFileSync(filePath).toString();
  //console.log(raw);
  const data = splitRows(raw, delimitter);
  const headers = normalizeHeaders(data.shift().split(","), source);
  //console.log(headers);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;
    if (i % 1000000 === 0) console.log(i);
    const contentCells = data[i].split(",");

    var jsonLine = {};
    applyDefaultColumns(jsonLine, columns);
    for (let i = 0; i < contentCells.length; i++) {
      if (!columns.find((e) => e.sourceName === headers[i])) console.log(headers[i]);

      const header = columns.find((e) => e.sourceName === headers[i]);
      //console.log(header);
      applyColumnValue(jsonLine, header, contentCells[i]);
    }

    json.push(jsonLine);
  }

  return json;
}

function getFolderFiles(folderNames) {
  return folderNames.flatMap((folderName) =>
    fs.readdirSync(path.resolve("data", folderName)).map((fileName) => `${folderName}/${fileName}`)
  );
}

async function parseSourceFile(filename) {
  return filename.endsWith(".csv") ? parseCSVFile(filename) : parseFile(filename);
}

function getOutputJsonName(filename) {
  const extension = path.extname(filename);
  const basename = filename.slice(0, -extension.length).replace(/[^a-z0-9]+/gi, "_");
  return `${basename}.json`;
}

function getIndexName(filename) {
  return /denom|denominator/i.test(filename) ? "denominator" : "mcaexplorer";
}

function writeBulkJson(filename, records, startId) {
  const outputJsonName = getOutputJsonName(filename);
  const indexName = getIndexName(filename);
  const fd = fs.openSync(path.resolve("data", outputJsonName), "w");
  let id = startId;

  try {
    records.map((record) => {
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: indexName,
            _id: id,
          },
        }) + "\n",
        "utf-8"
      );
      const cleanedObject = removeNewlines(record);
      fs.appendFileSync(fd, JSON.stringify(cleanedObject) + "\n", "utf-8");

      id++;
    });
  } finally {
    fs.closeSync(fd);
  }

  console.log(`Finish ${filename} import to ${outputJsonName}`);
  return id;
}

function removeNewlines(obj) {
  if (typeof obj === "string") {
    return obj.replace(/\n/g, "");
  } else if (Array.isArray(obj)) {
    return obj.map(removeNewlines);
  } else if (typeof obj === "object" && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = removeNewlines(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

(async function main() {
  let id = 1;
  const sourceFiles = getFolderFiles(["estBB", "iorra", "jap"]);

  for (const sourceFile of sourceFiles) {
    try {
      const records = await parseSourceFile(sourceFile);
      id = writeBulkJson(sourceFile, records, id);
    } catch (err) {
      console.log(`${sourceFile}: ${err}`);
    }
  }
})();
