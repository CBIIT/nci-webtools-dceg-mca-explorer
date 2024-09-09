import fs from "fs";
import path from "path";

import { sources } from "./sources_v3.js";

async function parseFile(filename, delimitter = "\r\n") {
  const filePath = path.resolve("data", filename);

  const columns = sources.find((e) => e.sourcePath.includes(filename)).columns;
  const raw = fs.readFileSync(filePath).toString();
  //console.log(columns);
  const data = raw.split(delimitter);
  const headers = data.shift().split("\t");
  //console.log(headers);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;

    const contentCells = data[i].split("\t");

    var jsonLine = {};
    for (let i = 0; i < contentCells.length; i++) {
      if (!columns.find((e) => e.sourceName === headers[i])) console.log(headers[i]);

      const header = columns.find((e) => e.sourceName === headers[i]);
      //console.log(header);
      jsonLine[header.name] = contentCells[i];
    }

    json.push(jsonLine);
  }

  return json;
}

async function parseCSVFile(filename, delimitter = "\r\n") {
  const filePath = path.resolve("data", filename);

  const columns = sources.find((e) => e.sourcePath.includes(filename)).columns;
  const raw = fs.readFileSync(filePath).toString();
  //console.log(raw);
  const data = raw.split(delimitter);
  const headers = data.shift().split(",");
  //console.log(headers);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;
    if (i % 1000000 === 0) console.log(i);
    const contentCells = data[i].split(",");

    var jsonLine = {};
    for (let i = 0; i < contentCells.length; i++) {
      if (!columns.find((e) => e.sourceName === headers[i])) console.log(headers[i]);

      const header = columns.find((e) => e.sourceName === headers[i]);
      //console.log(header);
      jsonLine[header.name] = contentCells[i];
    }

    json.push(jsonLine);
  }

  return json;
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
  const ukbbdenominator = await parseFile("UKBB_PLCO_V3/UKBB_denominator_92005app_clean.txt", "\r");
  var id = 1;

  try {
    var fd = fs.openSync(path.resolve("data", "ukbbdenominator.json"), "a");
    ukbbdenominator.map((e) => {
      e.dataset = "ukbb";
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: "denominator",
            _id: id,
          },
        }) + "\n",
        "utf-8"
      );
      const cleanedObject = removeNewlines(e);
      fs.appendFileSync(fd, JSON.stringify(cleanedObject) + "\n", "utf-8");

      id++;
    });
  } catch (err) {
    console.log(`${err}`);
  } finally {
    if (fd) {
      fs.closeSync(fd);
    }
    console.log(`Finish UKBB denominator import`);
  }
  const plcodenominator = await parseFile("UKBB_PLCO_V3/PLCO_denominator_clean.txt", "\r");
  try {
    var fd = fs.openSync(path.resolve("data", "plcodenominator.json"), "a");
    plcodenominator.map((e) => {
      e.dataset = "plco";
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: "denominator",
            _id: id,
          },
        }) + "\n",
        "utf-8"
      );
      const cleanedObject = removeNewlines(e);
      fs.appendFileSync(fd, JSON.stringify(cleanedObject) + "\n", "utf-8");

      id++;
    });
  } catch (err) {
    console.log(`${err}`);
  } finally {
    if (fd) {
      fs.closeSync(fd);
    }
    console.log(`Finish PLCO denominator import`);
  }
})();
