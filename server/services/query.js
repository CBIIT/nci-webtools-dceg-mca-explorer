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

export const AncestryOptions = [
  { value: "all", label: "All Ancestries" },
  { value: "1", label: "European" },
  { value: "2", label: "African" },
  { value: "3", label: "East Asian" },
  { value: "4", label: "African American" },
  { value: "5", label: "Latin American 1" },
  { value: "6", label: "Latin American 2" },
  { value: "7", label: "Asian-Pacific Islander" },
  { value: "8", label: "South Asian" },
  { value: "9", label: "Other" },
];
