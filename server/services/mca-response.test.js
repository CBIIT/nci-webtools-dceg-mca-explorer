import assert from "node:assert/strict";
import test from "node:test";
import { formatMcaResponse } from "./mca-response.js";

const event = {
  array: "WGS", sex: "1", PopID: "4", smokeNFC: "3", age: 76,
  cf: "0.1226", chromosome: "chr9", beginGrch38: "96851602", type: "Loss",
  dataset: "TOPMed_autosomal_mCAs", endGrch38: "107800260", length: 10948658,
};

test("response returns only five fields and two decimal places", () => {
  const payload = { merged: [event, { ...event, cf: "0.3999" }] };
  const before = structuredClone(payload);
  assert.deepEqual(formatMcaResponse(payload), {
    merged: [
      { chromosome: "chr9", start: "96851602", end: "107800260", type: "Loss", cf: "0.12" },
      { chromosome: "chr9", start: "96851602", end: "107800260", type: "Loss", cf: "0.40" },
    ],
  });
  assert.deepEqual(payload, before);
});

test("plot format cannot bypass field filtering; internal records keep full precision", () => {
  const payload = { merged: [event] };
  assert.deepEqual(formatMcaResponse(payload, "plot"), formatMcaResponse(payload));
  assert.equal(payload.merged[0].cf, "0.1226");
  assert.equal(payload.merged[0].dataset, "TOPMed_autosomal_mCAs");
});

test("cached compact responses keep their coordinates and formatting", () => {
  const compact = formatMcaResponse({ merged: [event] });
  assert.deepEqual(formatMcaResponse(compact), compact);
});

test("empty results, zero, and missing fractions keep their meaning", () => {
  assert.deepEqual(formatMcaResponse({ merged: [] }), { merged: [] });
  for (const cf of [null, undefined, "", "NA", "nan"]) {
    assert.equal(formatMcaResponse({ merged: [{ ...event, cf }] }).merged[0].cf, cf);
  }
  assert.equal(formatMcaResponse({ merged: [{ ...event, cf: 0 }] }).merged[0].cf, "0.00");
});
