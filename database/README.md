# nci-webtools-dceg-mosaic-tiler

A webtool cataloging mosaic chromosomal alterations (mCAs) and interactively examining frequently altered genomic regions

### Getting Started

1. In the `database` folder, create a `data` folder which contains the `PLCO_GSA_*.txt` datasets
2. In the `database` folder, run `node opensearch.js` script to create `*.json`
3. run docker-compose up to start opensearch
   run `node import-opensearch.js`
4. In the `server` folder, create an `.env` file based on `.env.example`
5. In the `server/.env` file, ensure that `DATABASE_PATH` refers to the location of `database.db`
6. In the `server` folder, run `npm start`
7. Navigate to `http://localhost:9000/api/ping` in the browser to verify the application is running

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

### Import data
in data folder: it has
1. PLCO
2. UKBB  - 09-10-2024
3. BIOVU - 08-05-2025

source.js define the columns of files
opensearch3.js will convert data as json by loading source.js: node convertJsonBiovu.js
import-opensearch2.js import json into opensearch db, 

### queries run on opensearch console:
GET _cat/indices?v

DELETE mcaexplorer
DELETE denominator

# run node import-opensearch.js to import --check import-opensearch to see if the json is what want to import
GET /mcaexplorer/_count
GET /denominator/_count

DELETE mcaexplorer_index
DELETE denominator_age

PUT mcaexplorer/_settings
{
  "index.max_result_window": 200000
}

PUT /mcaexplorer_index
{
  "mappings": {
    "properties": {
      "beginGrch38": {
          "type" : "long",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        },
         "endGrch38": {
          "type" : "long",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 256
            }
          }
        }
        
    }
  }
}


POST _reindex
{
  "source": {
    "index": "mcaexplorer"
  },
  "dest": {
    "index": "mcaexplorer_index"
  }
}


PUT mcaexplorer_index/_settings
{
  "index.max_result_window": 200000
}



PUT /denominator_age
	{
	  "mappings": {"properties": {
	      "age":{
	        "type": "integer"
	      }
	  }}
	  
	}
	
	
		POST /_reindex
	{
	  "source":{
	    "index": "denominator"
	  },
	  "dest":{
	    "index": "denominator_age"
	  },
	  "script": {
	    "source": """
	    if (ctx._source.age!=null){
	      def ageMatcher = /^[0-9]+$/.matcher(ctx._source.age);
	      if ( ageMatcher.matches()){
	        ctx._source.age = Integer.parseInt(ctx._source.age);
	      }else{
	        ctx._source.age = null;
	      }
	      
	    }
	    """,
	    "lang": "painless"
	  }
	  
	}
		
	PUT denominator_age/_settings
	{
	  "index.max_result_window": 200000
	}

