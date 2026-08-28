// Thickness controls how much radial space each event occupies in the STACK tracks.
// More negative = thinner bars, which fits more events without overlapping (avoids "partial events" in the summary table).
// THINNEST_THICKNESS is the lower bound users can dial in via the thickness slider; DEFAULT_THICKNESS is the starting value.
export const THINNEST_THICKNESS = -2;
export const THICKEST_THICKNESS = 1;
export const DEFAULT_THICKNESS = -1.96;
export const MAX_THICKNESS = THINNEST_THICKNESS;

// bars thinner than -1 sit close enough together that a stroke isn't needed and would blur them together;
// thicker bars (>= -1) show antialiasing gaps between adjacent arcs, so a matching-color stroke seals the seam
export function getStrokeWidth(thicknessValue) {
  return thicknessValue < -1 ? 0 : 2;
}

// maps the real [THINNEST_THICKNESS, THICKEST_THICKNESS] value to a [0, 1] value for display purposes only
export function normalizeThickness(value) {
  return (value - THINNEST_THICKNESS) / (THICKEST_THICKNESS - THINNEST_THICKNESS);
}

// inverse of normalizeThickness: converts a displayed [0, 1] value back to the real thickness value
export function denormalizeThickness(value) {
  return value * (THICKEST_THICKNESS - THINNEST_THICKNESS) + THINNEST_THICKNESS;
}

// fixed pixel size the summary CircosPlot is always rendered at (see CirclePlotTest.js's circleSize)
export const SUMMARY_CIRCLE_SIZE = 850;

// fractional [innerRadius, outerRadius] of each STACK track, as configured in CirclePlot.js
const TRACK_BANDS = {
  undetermined: [0.05, 0.25],
  loss: [0.25, 0.5],
  loh: [0.5, 0.75],
  gain: [0.75, 1],
};

// matches the circos Stack track's default radialMargin (CirclePlot.js doesn't override it)
const RADIAL_MARGIN = 2;

// Reimplements circos's Stack track layering (see node_modules/circos/src/tracks/Stack.js#buildLayers):
// events for the same chromosome are sorted by start and greedily packed into the first layer whose
// last event ends before the new one starts; anything that doesn't fit opens a new layer.
function getMaxLayers(events) {
  const eventsByChromosome = new Map();
  for (const event of events) {
    const key = event.block_id;
    if (!eventsByChromosome.has(key)) eventsByChromosome.set(key, []);
    eventsByChromosome.get(key).push(event);
  }

  let maxLayers = 0;
  eventsByChromosome.forEach((chromosomeEvents) => {
    const sorted = [...chromosomeEvents].sort((a, b) => Number(a.start) - Number(b.start));
    const layerEnds = [];
    sorted.forEach(({ start, end }) => {
      const layerIndex = layerEnds.findIndex((lastEnd) => lastEnd < Number(start));
      if (layerIndex === -1) layerEnds.push(Number(end));
      else layerEnds[layerIndex] = Number(end);
    });
    maxLayers = Math.max(maxLayers, layerEnds.length);
  });
  return maxLayers;
}

// thinnest thickness that still lets `maxLayers` stacked events fit inside `bandPx` without
// clamping to the track's outer radius (inverse of circos Stack's radial position formula)
function thicknessForLayers(maxLayers, bandPx) {
  if (maxLayers <= 1) return THICKEST_THICKNESS;
  const value = (bandPx - RADIAL_MARGIN * (maxLayers - 1)) / maxLayers;
  return Math.min(THICKEST_THICKNESS, Math.max(THINNEST_THICKNESS, value));
}

// Picks one shared thickness (used by all 4 stacked tracks) that fits the densest track's
// worst-case overlap, based on the actual event counts/positions rather than a fixed default.
export function computeAutoThickness({ gain = [], loss = [], loh = [], undetermined = [], chrx = [], chry = [] }, circleSize = SUMMARY_CIRCLE_SIZE) {
  const layoutInnerRadius = circleSize / 2 - 50;
  const tracks = { undetermined, loss: loss.concat(chrx, chry), loh, gain };

  let thickness = THICKEST_THICKNESS;
  for (const [name, [innerFraction, outerFraction]] of Object.entries(TRACK_BANDS)) {
    const bandPx = (outerFraction - innerFraction) * layoutInnerRadius;
    const maxLayers = getMaxLayers(tracks[name]);
    thickness = Math.min(thickness, thicknessForLayers(maxLayers, bandPx));
  }
  return thickness;
}

