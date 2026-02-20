export function parseRangeLable(value) {
  if (!value || typeof value !== "string") return null;

  const match = value.trim().match(/^chr([0-9]{1,2}|x|y)\s*:\s*([\d,]+)\s*-\s*([\d,]+)$/i);
  if (!match) return null;

  const chrToken = match[1];
  const start = match[2].replace(/,/g, "");
  const end = match[3].replace(/,/g, "");

  const chrLabel = /^[0-9]+$/.test(chrToken) ? Number(chrToken) : chrToken.toUpperCase();
  const chrValue = "chr" + chrToken.toUpperCase();

  return {
    chrOption: { value: chrValue, label: chrLabel },
    start,
    end,
  };
}
