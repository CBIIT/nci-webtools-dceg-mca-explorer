# nci-webtools-dceg-mosaic-tiler

A webtool cataloging mosaic chromosomal alterations (mCAs) and interactively examining frequently altered genomic regions

### Getting Started

1. In the `database` folder, create a `data` folder which contains the `PLCO_GSA_*.txt` datasets
2. In the `database` folder, run `node opensearch.js` script to create `*.json`
   run `node import-opensearch.js`
3. In the `server` folder, create an `.env` file based on `.env.example`
4. In the `server/.env` file, ensure that `DATABASE_PATH` refers to the location of `database.db`
5. In the `server` folder, run `npm start`
6. Navigate to `http://localhost:9000/api/ping` in the browser to verify the application is running

### Example Query

```js
fetch("/api/query/samples", {
  method: "post",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    conditions: [
      ["dataset", "in", ["PLCO_GSA_blood_autosomal_mCAs", "PLCO_GSA_blood_mLOY"]],
      ["chromosome", "in", ["chr1", "chrX"]],
      ["computedGender", "M"],
      ["callRate", ">", 0.99],
      ["cf", ">", 0.1],
    ],
  }),
}).then(async (e) => console.log(await e.json()));
```
