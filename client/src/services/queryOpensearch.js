import { Client } from '@opensearch-project/opensearch';

const host =`http://admin:admin@localhost:9200`
const client = new Client({
  node: host,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function fetchChromosomeData(qstring) {
  const chr = qstring.chr
      const { body } = await client.search({
        index: 'mcaexplorer',
        body: {
          query: {
            match: {
              "chromosome": chr
            },
          },
        },
      });
      return body.hits.hits;
    }
