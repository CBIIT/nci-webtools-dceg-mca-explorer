import fs from "fs";
import path from "path";

import { sources } from "./sources_v4.js";

const chromosomeLayoutPath = path.resolve("..", "client", "src", "modules", "components", "summaryChart", "CNV", "layout2.json");
const chromosomeLengths = loadChromosomeLengths(chromosomeLayoutPath);

function loadChromosomeLengths(layoutPath) {
  const layout = JSON.parse(fs.readFileSync(layoutPath).toString());
  return layout.reduce((lengths, chromosome) => {
    lengths[String(chromosome.id)] = Number(chromosome.len);
    return lengths;
  }, {});
}

function normalizeChromosomeId(chromosome) {
  return String(chromosome || "").replace(/^chr/i, "");
}

function getSource(filename) {
  return sources.find((e) => e.sourcePath === filename || e.sourcePath.includes(filename));
}

function getFilePath(filename) {
  const directPath = path.resolve(filename.startsWith("data/") ? filename : path.join("data", filename));
  if (fs.existsSync(directPath)) return directPath;

  const basename = path.basename(filename);
  const matches = findFilesByBasename(path.resolve("data"), basename);
  return (
    matches.find((match) => match.includes(`${path.sep}raw_v3_20240916${path.sep}`)) ||
    matches.find((match) => match.includes(`${path.sep}raw${path.sep}`)) ||
    matches[0] ||
    directPath
  );
}

function findFilesByBasename(directory, basename) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findFilesByBasename(entryPath, basename);
    return entry.name === basename ? [entryPath] : [];
  });
}

function applyColumnValue(jsonLine, column, value) {
  const normalizedValue = normalizeCellValue(value);
  jsonLine[column.name] = column.formatter ? column.formatter(normalizedValue) : normalizedValue;
}

function normalizeCellValue(value) {
  if (typeof value !== "string") return value;

  const unquotedValue = value.replace(/^"(.*)"$/, "$1").replace(/""/g, '"');
  if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(unquotedValue)) {
    return unquotedValue.replace(/,/g, "");
  }

  return unquotedValue;
}

function applySourceColumnValues(jsonLine, columns, sourceName, value, filename) {
  const headers = columns.filter((column) => column.sourceName === sourceName);
  if (headers.length === 0) {
    console.log(`${filename}: missing column mapping for ${sourceName}`);
    return;
  }

  headers.forEach((header) => applyColumnValue(jsonLine, header, value));
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

function splitTextCells(row) {
  return row.includes("\t") ? row.split("\t") : row.trim().split(/\s+/);
}

async function parseFile(filename, delimitter) {
  const filePath = getFilePath(filename);

  const source = getSource(filename);
  const columns = source.columns;
  const raw = fs.readFileSync(filePath).toString();
  //console.log(columns);
  const data = splitRows(raw, delimitter);
  const headers = normalizeHeaders(splitTextCells(data.shift()), source);
  //console.log(headers);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;

    const contentCells = splitTextCells(data[i]);

    var jsonLine = {};
    applyDefaultColumns(jsonLine, columns);
    for (let i = 0; i < contentCells.length; i++) {
      if (!headers[i]) {
        console.log(`${filename}: missing column mapping for undefined`);
        continue;
      }
      applySourceColumnValues(jsonLine, columns, headers[i], contentCells[i], filename);
    }

    json.push(jsonLine);
  }

  return json;
}

async function parseCSVFile(filename, delimitter) {
  const filePath = getFilePath(filename);

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
      if (!headers[i]) {
        console.log(`${filename}: missing column mapping for undefined`);
        continue;
      }
      applySourceColumnValues(jsonLine, columns, headers[i], contentCells[i], filename);
    }

    json.push(jsonLine);
  }

  return json;
}

function getSourceFiles() {
  return sources.map((source) => source.sourcePath);
}

async function parseSourceFile(filename) {
  return filename.endsWith(".csv") ? parseCSVFile(filename) : parseFile(filename);
}

function getIndexName(filename) {
  return /denom|denominator/i.test(filename) ? "denominator" : "mcaexplorer";
}

function validateChromosomeBoundaries(filename, records) {
  const invalidRecords = records.reduce((invalid, record, index) => {
    if (record.endGrch38 === undefined) return invalid;

    const chromosome = normalizeChromosomeId(record.chromosome);
    const chromosomeLength = chromosomeLengths[chromosome];
    const end = Number(record.endGrch38);

    if (!Number.isFinite(chromosomeLength) || !Number.isFinite(end) || end > chromosomeLength) {
      invalid.push({
        row: index + 2,
        sampleId: record.sampleId,
        chromosome: record.chromosome,
        endGrch38: record.endGrch38,
        chromosomeLength,
      });
    }

    return invalid;
  }, []);

  if (invalidRecords.length === 0) return;

  const examples = invalidRecords
    .slice(0, 10)
    .map((record) => JSON.stringify(record))
    .join("\n");
  throw new Error(`${filename}: ${invalidRecords.length} rows have endGrch38 outside layout2.json chromosome boundaries\n${examples}`);
}

function appendBulkJson(fd, filename, records, nextIds) {
  const indexName = getIndexName(filename);
  let id = nextIds[indexName] || 1;

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

  nextIds[indexName] = id;
  console.log(`Finish ${filename} import: ${records.length} rows`);
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
  const nextIds = {
    mcaexplorer: 1,
    denominator: 1,
  };
  let totalRows = 0;
  const sourceFiles = getSourceFiles();
  const outputJsonName = "all.json";
  const fd = fs.openSync(path.resolve("data", outputJsonName), "w");

  try {
    for (const sourceFile of sourceFiles) {
      try {
        const records = await parseSourceFile(sourceFile);
        validateChromosomeBoundaries(sourceFile, records);
        appendBulkJson(fd, sourceFile, records, nextIds);
        totalRows += records.length;
      } catch (err) {
        console.log(`${sourceFile}: ${err}`);
      }
    }
  } finally {
    fs.closeSync(fd);
  }

  console.log(`Finish all imports to ${outputJsonName}`);
  console.log(`Total rows: ${totalRows}`);
})();
