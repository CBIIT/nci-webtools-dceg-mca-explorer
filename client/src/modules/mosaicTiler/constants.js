export const AncestryOptions = [
  { value: "all", label: "All Ancestries" },
  { value: "ADMIXED_EUR", label: "ADMIXED_EUR" },
  { value: "AFR", label: "African" },
  { value: "AFR_EUR", label: "AFR_EUR" },
  { value: "ASN", label: "Asian" },
  { value: "ASN_EUR", label: "ASN_EUR" },
  { value: "EUR", label: "European" },
];

export const CompareArray = [
  { id: 1, value: "array", label: " Detection Approach", isChecked: false, order: 3 },
  { id: 2, value: "sex", label: " Genotype Sex", isChecked: false, order: 4 },
  { id: 3, value: "age", label: " Age", isChecked: false, order: 5 },
  { id: 4, value: "ancestry", label: " Ancestry", isChecked: false, order: 6 },
  { id: 5, value: "study", label: " Study", isChecked: true, order: 1 },
  { id: 6, value: "cf", label: " Cellular Fraction", isChecked: false, order: 7 },
  { id: 7, value: "smoking", label: " Smoking Status", isChecked: false, order: 8 },
  { id: 8, value: "types", label: " Copy Number State", isChecked: true, order: 2 },
  { id: 9, value: "range", label: " Range", isChecked: false, order: 9 },
];

export const TypeStateOptions = [
  { value: "all", label: "All Event Types" },
  { value: "loh", label: "CN-LOH" },
  { value: "loss", label: "Loss" },
  { value: "gain", label: "Gain" },
  { value: "undetermined", label: "Undetermined" },
];

export const StudyOptions = [
  { value: "plco", label: "PLCO" },
  { value: "ukbb", label: "UK Biobank" },
];

export const SexOptions = [
  { value: "all", label: "All Sexes" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

export const initialX = [
  { block_id: "X", start: "0", end: "0", type: "Gain" },
  { block_id: "X", start: "0", end: "0", type: "Loss" },
  { block_id: "X", start: "0", end: "0", type: "CN-LOH" },
  { block_id: "X", start: "0", end: "0", type: "Undetermined" },
];
export const initialY = [
  { block_id: "Y", start: "0", end: "0", type: "Gain" },
  { block_id: "Y", start: "0", end: "0", type: "Loss" },
  { block_id: "Y", start: "0", end: "0", type: "CH-LOH" },
  { block_id: "Y", start: "0", end: "0", type: "Undetermined" },
];
