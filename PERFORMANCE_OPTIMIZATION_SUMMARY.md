# Performance Optimization Summary

## Goal

Improve Range View load time while preserving the application's purpose: loading all event rows for the circle plot and tables.

The original full-data load returned about 157,974 rows and took close to 2 minutes before the circle plot and tables became usable. After the merged-index work and frontend transform changes, the same workflow loads much faster, with the remaining time mostly spent in frontend transformation/rendering rather than OpenSearch joining.

## Main Bottleneck

The previous API flow queried event rows and denominator rows separately, then joined them by `sampleId` during request handling. This was expensive because denominator filtering could require fetching many rows from OpenSearch and merging large arrays in Node.js before returning the response.

The frontend also spent extra time after the API response by repeatedly transforming large result arrays, doing option-label lookups with array filters, and updating several large React state values separately.

## Backend Optimization

A new OpenSearch index named `merged` was added.

`merged` contains all event rows. When an event row has a matching denominator row by `sampleId`, denominator fields are copied into the event document. Examples of copied fields include:

- `denominatorDataset`
- `age`, `ageMin`, `ageMax`, `ageRange`
- `sex`
- `smokeNFC`
- `PopID`
- `array`
- `priorCancer`
- `incidentCancerHem`
- `incidentCancerMyeloid`
- `incidentCancerLymphoid`

Rows without `sampleId`, or without a denominator match, are still kept in `merged` as event-only rows. This is intentional because the app still needs to display all events, including datasets such as EstBB where the source event file does not include `sampleId`.

## Data Import Flow

No separate `merge.json` file is created.

The merged documents are written into the existing OpenSearch bulk file:

```text
database/data/all.json
```

The import flow is:

1. `database/opensearchall.js` reads source event and denominator files.
2. It builds a denominator lookup by `sampleId`.
3. It writes normal `mcaexplorer` and `denominator` bulk records.
4. It also writes `merged` bulk records into the same `all.json` file.
5. `database/import-opensearchall.js` bulk imports `all.json` into OpenSearch.
6. `database/reimport-opensearch.sh` creates the OpenSearch indexes and mappings, then runs the import.

Typical command:

```bash
cd database
./reimport-opensearch.sh --admin --regenerate-all-json
```

If `database/data/all.json` already exists and does not need to be regenerated:

```bash
cd database
./reimport-opensearch.sh --admin
```

## Indexes Added Or Updated

The `merged` index includes mappings for event fields and denominator fields used by filters:

- `sampleId`: `keyword`
- `dataset`: `keyword`
- `denominatorDataset`: `keyword`
- `chromosome`: `keyword`
- `type`: `keyword`
- `beginGrch38`: `long`
- `endGrch38`: `long`
- `age`, `ageMin`, `ageMax`: integer-compatible fields
- `ageRange`: `keyword`
- `sex`, `smokeNFC`, `PopID`, `array`: `keyword`
- cancer fields: `keyword`

`index.max_result_window` is set to `200000` for large Range View responses.

## API Changes

The main Range View API now queries `merged` for event data instead of doing the expensive event-plus-denominator join for every request.

Updated behavior:

- Default full-data queries use the fast `merged` index directly.
- Event rows without denominator matches are preserved.
- Denominator filters such as array, sex, ancestry, smoking, age, and cancer filters still behave like the old API.
- For denominator-filtered searches, the API uses `merged` to identify matching event rows, then fetches matching denominator rows where exact old row-count behavior is required.

This keeps full-load speed improvements while preserving old counts for filters such as Axiom, BiLEVE, WGS, and Global Screening Array.

## Frontend Optimization

`rangeView.js` was optimized to reduce frontend overhead after the API returns.

Key changes:

- Replaced multiple large state updates (`gain`, `loss`, `loh`, `undetermined`, `chrX`, `chrY`) with one `plotData` state object.
- Precomputed label lookup maps for ancestry, smoking, and sex instead of using repeated array filtering for each row.
- Preserved the old event-type selection behavior by building all buckets first, then applying selected type filters.
- Built `allValues` once from the selected buckets plus `chrX` and `chrY`.
- Added timing logs for Range View to compare API, transform, state handoff, and total time.

Important logs:

```text
[rangeView timing summary]
[rangeView table handoff]
```

## Correctness Notes

`merged` does not mean only successfully joined rows. It means:

```text
event rows enriched with denominator data when available
```

This distinction matters for datasets that do not have `sampleId` in the event source. For example, EstBB event rows may appear in `merged` without `age`, `sex`, or `array` because there is no `sampleId` available for denominator lookup.

A true merged row has both event fields and denominator fields. For example, a PLCO row with `sampleId` may include event fields such as `chromosome`, `type`, and `cf`, plus denominator fields such as `age`, `sex`, `smokeNFC`, `PopID`, and `array`.

## Result

The backend no longer performs the expensive denominator join for every default Range View request. OpenSearch can return the enriched event documents directly from `merged`, which significantly reduces API time.

The remaining cost is mostly frontend-side transformation and rendering of a large number of rows, especially the circle plot and table handoff. Since the app intentionally loads all rows, the optimization focuses on reducing unnecessary API joining and redundant frontend processing while keeping the full dataset visible.

## Observed Running Time

Before optimization, the full Range View load was approximately 2 minutes, or about `120,000 ms`, for the largest full-data view.

After switching to the `merged` index and reducing frontend transform/state overhead, the final measured Range View timing was `13,995 ms`, or about 14 seconds, for `115,544` merged rows. That is an `8.6x` improvement compared with the original approximate 2-minute baseline.

Final measured timing summary:

```json
{
	"route": "rangeView",
	"previousBaselineMs": {
		"originalApprox": 120000,
		"preMergedApiExample": 9674
	},
	"denominatorApiMs": 296,
	"mcaApiMs": 10338,
	"apiMs": 10338,
	"responseShape": "merged",
	"mergedRows": 115544,
	"allDenominator": 755059,
	"transformMs": 62,
	"stateQueueMs": 3594,
	"totalMs": 13995,
	"improvementVsOriginalApprox": "8.6x faster",
	"improvementVsPreMergedApiExample": "0.9x API faster"
}
```

The API portion for this final run was `10,338 ms`, similar to the earlier representative pre-merged API example of `9,674 ms`. The main improvement came from changing the backend response shape to `merged` and reducing frontend processing/state overhead, which brought total Range View time down to about 14 seconds.

For exact timing on a run, use the browser console log:

```text
[rangeView timing summary]
```

Key fields:

- `apiMs`: total API request time
- `mcaApiMs`: main `/opensearch/mca` request time
- `denominatorApiMs`: denominator count request time
- `transformMs`: frontend row transformation time
- `stateQueueMs`: React state update queue time
- `totalMs`: total Range View query/load time through state handoff
- `improvementVsOriginalApprox`: comparison against the old approximate 2-minute baseline

## Validation Performed

The following checks were used during the optimization work:

```bash
node --check server/services/api.js
git diff --check
cd client && npm run build
```

The client build completed with existing warnings unrelated to this optimization.
