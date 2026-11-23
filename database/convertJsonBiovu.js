import fs from "fs";
import path from "path";

import { sources } from "./sources_v3.js";

function deleteFileIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

    }
  } catch (err) {

  }
}

async function parseFile(filename, delimitter = "\r\n", columnSeparator = "\t") {
  const filePath = path.resolve("data", filename);
  const fullPath = `data/${filename}`;

  const sourceConfig = sources.find((e) => e.sourcePath === fullPath || e.sourcePath.includes(filename));
  
  const columns = sourceConfig?.columns;
  if (!columns) {

    return [];
  }
  
  const raw = fs.readFileSync(filePath).toString();
  const data = raw.split(delimitter);
  const headers = data.shift().split(columnSeparator);
  var json = [];

  for (let i = 0; i < data.length; i++) {
    if (/^\s*$/.test(data[i])) continue;

    const contentCells = data[i].split(columnSeparator);

    var jsonLine = {};
    for (let i = 0; i < contentCells.length; i++) {
      const header = columns.find((e) => e.sourceName === headers[i]);
      if (!header) {

        continue;
      }
      
      // Apply formatter if it exists
      let value = contentCells[i];
      if (header.formatter && typeof header.formatter === 'function') {
        value = header.formatter(value);
      }
      
      jsonLine[header.name] = value;
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
    if (i % 1000000 === 0) {}
    const contentCells = data[i].split(",");

    var jsonLine = {};
    for (let i = 0; i < contentCells.length; i++) {
      if (!columns.find((e) => e.sourceName === headers[i])) {}

      const header = columns.find((e) => e.sourceName === headers[i]);
      //console.log(header);
      
      // Apply formatter if it exists
      let value = contentCells[i];
      if (header && header.formatter && typeof header.formatter === 'function') {
        value = header.formatter(value);
      }
      
      if (header) {
        jsonLine[header.name] = value;
      }
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
  var id = 686880;

  // Process BioVU denominator data

  const biovuDenominator = await parseFile("biovu/BioVU_denominator_clean_02052025.txt", "\n", "\t");

  
  const denominatorFilePath = path.resolve("data", "biovudenominator.json");
  deleteFileIfExists(denominatorFilePath);
  
  try {
    var fd = fs.openSync(denominatorFilePath, "w");
    biovuDenominator.map((e) => {
      e.dataset = "biovu";
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

  } finally {
    if (fd) {
      fs.closeSync(fd);
    }

  }

  // Process BioVU autosomal mCAs data

  const biovuAuto = await parseFile("biovu/BioVU_autosomalmcas_clean_02052025.txt", "\n", " ");
  
  const autoFilePath = path.resolve("data", "biovuAuto.json");
  deleteFileIfExists(autoFilePath);
  
  try {
    var fd = fs.openSync(autoFilePath, "w");
    biovuAuto.map((e) => {
      e.dataset = "biovu";
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: "mcaexplorer",
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

  } finally {
    if (fd) {
      fs.closeSync(fd);
    }

  }

  // Process BioVU mLOX data

  const biovuLox = await parseFile("biovu/BioVU_mlox_clean_02052025.txt", "\n", " ");
  
  const loxFilePath = path.resolve("data", "biovumLOX.json");
  deleteFileIfExists(loxFilePath);
  
  try {
    var fd = fs.openSync(loxFilePath, "w");
    biovuLox.map((e) => {
      e.dataset = "biovu";
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: "mcaexplorer",
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

  } finally {
    if (fd) {
      fs.closeSync(fd);
    }

  }

  // Process BioVU mLOY data

  const biovuLoy = await parseFile("biovu/BioVU_mloy_clean_02052025.txt", "\n", " ");
  
  const loyFilePath = path.resolve("data", "biovumLOY.json");
  deleteFileIfExists(loyFilePath);
  
  try {
    var fd = fs.openSync(loyFilePath, "w");
    biovuLoy.map((e) => {
      e.dataset = "biovu";
      fs.appendFileSync(
        fd,
        JSON.stringify({
          index: {
            _index: "mcaexplorer",
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

  } finally {
    if (fd) {
      fs.closeSync(fd);
    }

  }
})();
