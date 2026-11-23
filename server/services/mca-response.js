export const formatMcaResponse = (payload) => {
  return {
    merged: payload.merged.map((row) => {
      const numericCf = Number(row.cf);
      const cf =
        row.cf !== null && row.cf !== undefined && row.cf !== "" && Number.isFinite(numericCf)
          ? numericCf.toFixed(2)
          : row.cf;
      return {
        chromosome: row.chromosome,
        start: row.start ?? row.beginGrch38,
        end: row.end ?? row.endGrch38,
        type: row.type,
        cf,
      };
    }),
  };
};
