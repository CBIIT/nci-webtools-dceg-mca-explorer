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

// render order of the STACK tracks, innermost to outermost (must match CirclePlot.js's track array)
const TRACK_ORDER = ["undetermined", "loss", "loh", "gain"];

// full radial range ([0.05, 0.25, 0.5, 0.75, 1] originally) shared out across the present track types
const BAND_START = 0.05;
const BAND_END = 1;

// Splits [BAND_START, BAND_END] evenly across only the track types that have data, packing them
// consecutively in TRACK_ORDER so a type with no events collapses to a zero-width band.
// Note: empty bands use [BAND_START, BAND_START], NOT [0, 0] - circos's computeRadius() special-cases
// an exact (0, 0) pair to mean "auto-place this track" (see node_modules/circos/src/config-utils.js),
// which pushed the empty track out near the outer edge instead of hiding it.
export function computeTrackBands(hasDataByType) {
  const presentTypes = TRACK_ORDER.filter((name) => hasDataByType[name]);
  const bands = {};
  if (presentTypes.length === 0) {
    TRACK_ORDER.forEach((name) => (bands[name] = [BAND_START, BAND_START]));
    return bands;
  }

  const width = (BAND_END - BAND_START) / presentTypes.length;
  let cursor = BAND_START;
  TRACK_ORDER.forEach((name) => {
    if (!hasDataByType[name]) {
      bands[name] = [BAND_START, BAND_START];
      return;
    }
    bands[name] = [cursor, cursor + width];
    cursor += width;
  });
  return bands;
}

// matches the circos Stack track's default radialMargin (CirclePlot.js doesn't override it)
const RADIAL_MARGIN = 2;

// Beyond this many stacked layers, individual arcs are sub-pixel thin and visually indistinguishable
// from each other whether they overlap or not - so there's no benefit to shrinking thickness further
// to guarantee zero overlap for cohort-scale tracks with tens of thousands of events. Value picked
// empirically: users report ~2200-2300 stacked layers already render as one solid band.
const MAX_LAYERS_FOR_THICKNESS = 2200;

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

// thinnest thickness that still lets `layers` stacked events fit inside `bandPx` without
// clamping to the track's outer radius (inverse of circos Stack's radial position formula)
function thicknessForLayers(layers, bandPx) {
  if (layers <= 1) return THICKEST_THICKNESS;
  const value = (bandPx - RADIAL_MARGIN * (layers - 1)) / layers;
  return Math.min(THICKEST_THICKNESS, Math.max(THINNEST_THICKNESS, value));
}

// Picks one shared thickness (used by all 4 stacked tracks) that fits the densest track's
// overlap (capped at MAX_LAYERS_FOR_THICKNESS), based on actual event positions rather than a fixed default.
export function computeAutoThickness({ gain = [], loss = [], loh = [], undetermined = [], chrx = [], chry = [] }, circleSize = SUMMARY_CIRCLE_SIZE) {
  const layoutInnerRadius = circleSize / 2 - 50;
  const tracks = { undetermined, loss: loss.concat(chrx, chry), loh, gain };
  const hasData = Object.fromEntries(TRACK_ORDER.map((name) => [name, tracks[name].length > 0]));
  const bands = computeTrackBands(hasData);

  let thickness = THICKEST_THICKNESS;
  for (const name of TRACK_ORDER) {
    const [innerFraction, outerFraction] = bands[name];
    if (outerFraction <= innerFraction) continue; // empty track has no band to fit into
    const bandPx = (outerFraction - innerFraction) * layoutInnerRadius;
    const layers = Math.min(getMaxLayers(tracks[name]), MAX_LAYERS_FOR_THICKNESS);
    thickness = Math.min(thickness, thicknessForLayers(layers, bandPx));
  }
  return thickness;
}

