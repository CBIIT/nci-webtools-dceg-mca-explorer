import knex from "knex";
import { checkHeartbeat } from "knex-utils";

export function getConnection(filename) {
  return knex({
    client: "better-sqlite3",
    connection: { filename },
    useNullAsDefault: true,
  });
}

export async function getSamples(connection, query) {
  const { columns, conditions, offset, limit, orderBy } = query;

  let sqlQuery = connection("sample")
    .select(columns || "*")
    .offset(offset || 0)
    .limit(limit || 10000)
    .orderBy(orderBy || "id");

  for (let condition of conditions || []) {
    sqlQuery = sqlQuery.where(...condition);
  }

  return await sqlQuery;
}

export async function getStatus(connection) {
  const results = await checkHeartbeat(connection);
  return results.isOk;
}

