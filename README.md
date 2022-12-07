# nci-webtools-dceg-mosaic-tiler

A webtool cataloging mosaic chromosomal alterations (mCAs) and interactively examining frequently altered genomic regions

### Getting Started

1. In the "database" folder, create a "data" folder which contains the PLCO_GSA\_\*.txt datasets
2. In the "database" folder, run "node createDatabase.js" script to create "database.db"
3. In the "server" folder, create an ".env" file based on ".env.example"
4. In the ".env" file, ensure that DATABASE_PATH refers to the location of "database.db". Eg: ../database/database.db
5. In the server folder, run "npm start:"
6. Navigate to htttp://localhost:10000/api/ping in the browser to verify the application is running
