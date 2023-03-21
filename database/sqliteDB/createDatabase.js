import { fileURLToPath, pathToFileURL } from "url";
import { resolve } from "path";
import minimist from "minimist";
import { createConnection, initializeSchema, importSources } from "./services/utils.js";
import { unlink } from "fs/promises";

// determine if this script was launched from the command line
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
  const args = minimist(process.argv.slice(2));
  const schemaPath = pathToFileURL(args.schema || "./schema.js");
  const sourcesPath = pathToFileURL(args.schema || "./sources.js");
  const databasePath = resolve(args.database || "./database.db");

  const { schema } = await import(schemaPath);
  const { sources } = await import(sourcesPath);
  const connection = createConnection(databasePath);

  await initializeSchema(connection, schema);
  await importSources(connection, sources);

  console.log("Created database");
  process.exit(0);
}
