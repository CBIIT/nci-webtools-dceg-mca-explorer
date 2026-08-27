// Thickness controls how much radial space each event occupies in the STACK tracks.
// More negative = thinner bars, which fits more events without overlapping (avoids "partial events" in the summary table).
// THINNEST_THICKNESS is the safe default; THICKEST_THICKNESS is the upper bound users can dial in via the thickness slider.
export const THINNEST_THICKNESS = -1.94;
export const THICKEST_THICKNESS = -1;
export const MAX_THICKNESS = THINNEST_THICKNESS;
