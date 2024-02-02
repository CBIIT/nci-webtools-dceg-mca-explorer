import * as math from "mathjs";
/**
 * Packs an array of potentially overlapping ranges into rows, where each row
 * contains non-overlapping ranges, separated by a single space
 * @param {[number, number][]} ranges
 */
export function packRanges(ranges) {
  let rows = [];
  let MIN_INDEX = 0;
  let MAX_INDEX = 1;

  // sort rows by min, then max range value
  let sortedRanges = [...ranges].sort((a, b) => a[MIN_INDEX] - b[MIN_INDEX] || a[MAX_INDEX] - b[MAX_INDEX]);

  for (let range of sortedRanges) {
    // attempt to insert the current range into an existing row
    let insertedRange = false;
    for (let row of rows) {
      if (!row.length || insertedRange) break;
      let lastRange = row[row.length - 1];

      // look for a row where the highest range is below the current range
      // to eliminate space, use <= instead of <
      if (lastRange[MAX_INDEX] < range[MIN_INDEX]) {
        row.push(range);
        insertedRange = true;
      }
    }

    // if no valid rows could be found, insert the range into a new row
    if (!insertedRange) rows.push([range]);
  }

  return rows;
}

export function fisherTest(a, b, c, d) {
  const total = a + b + c + d;
  const row1Total = a + b;
  const row2Total = c + d;
  const col1Total = a + c;
  const col2Total = b + d;

  let observedP = math.divide(
    math.multiply(math.combinations(row1Total, a), math.combinations(row2Total, c)),
    math.combinations(total, col1Total)
  );

  let p = 0;
  const lowerBound = Math.max(0, col1Total - row2Total);
  const upperBound = Math.min(row1Total, col1Total);

  for (let x = lowerBound; x <= upperBound; x++) {
    let prob = math.divide(
      math.multiply(math.combinations(row1Total, x), math.combinations(row2Total, col1Total - x)),
      math.combinations(total, col1Total)
    );

    if (prob <= observedP) {
      p = math.add(p, prob);
    }
  }
  return p;
}
