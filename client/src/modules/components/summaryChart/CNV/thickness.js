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

