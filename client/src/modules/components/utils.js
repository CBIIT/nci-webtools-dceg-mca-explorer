
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
  let sortedRanges = [...ranges].sort(
    (a, b) => a[MIN_INDEX] - b[MIN_INDEX] || a[MAX_INDEX] - b[MAX_INDEX]
  );

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
