import { inspect } from "util";
import { createLogger, format, transports } from "winston";

export function objectToString(object) {
  return !["string", "number"].includes(typeof object)
    ? inspect(object, { depth: null, compact: true, breakLength: Infinity })
    : object;
}

export function formatLogMessage({ label, timestamp, level, message }) {
  return [
    [label, timestamp, level]
      .filter(Boolean)
      .map((s) => `[${s}]`)
      .join(" "),
    objectToString(message),
  ].join(" - ");
}

export function getLogger(name, level = process.env.LOG_LEVEL || "info") {
  return new createLogger({
    level,
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.label({ label: name }),
      format.printf(formatLogMessage)
    ),
    transports: [new transports.Console()],
    exitOnError: false,
  });
}
