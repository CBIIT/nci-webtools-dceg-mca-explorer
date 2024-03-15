export const AncestryOptions = [
  { value: "all", label: "All Ancestries" },
  { value: "1", label: "European" },
  { value: "2", label: "African" },
  { value: "3", label: "East Asian" },
  { value: "4", label: "African American" },
  { value: "5", label: "Latin American 1" },
  { value: "6", label: "Latin American 2" },
  { value: "7", label: "Asian-Pacific Islander" },
  { value: "8", label: "South Asian" },
  { value: "9", label: "Other" },
];

export const CompareArray = [
  { id: 1, value: "approach", label: " Array Platform", isChecked: false, order: 3 },
  { id: 2, value: "sex", label: " Genotype Sex", isChecked: false, order: 4 },
  { id: 3, value: "age", label: " Age", isChecked: false, order: 5 },
  { id: 4, value: "ancestry", label: " Ancestry", isChecked: false, order: 6 },
  { id: 5, value: "study", label: " Study", isChecked: true, order: 1 },
  { id: 6, value: "cf", label: " Cellular Fraction", isChecked: false, order: 7 },
  { id: 7, value: "smoking", label: " Smoking Status", isChecked: false, order: 8 },
  { id: 8, value: "types", label: " Copy Number State", isChecked: true, order: 2 },
  { id: 9, value: "range", label: " Range", isChecked: false, order: 9 },
  { id: 10, value: "priorCancer", label: " Prior Cancer", isChecked: false, order: 10 },
  { id: 11, value: "hemaCancer", label: " Incident Hematological Cancer", isChecked: false, order: 11 },
  { id: 12, value: "lymCancer", label: " Incident Lymphoid Cancer", isChecked: false, order: 12 },
  { id: 13, value: "myeCancer", label: " Incident Myeloid Cancer", isChecked: false, order: 13 },
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
  { value: "1", label: "Male" },
  { value: "0", label: "Female" },
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

export const smokeNFC = [
  { value: "all", label: "All status" },
  { value: "0", label: "Never" },
  { value: "1", label: "Former" },
  { value: "2", label: "Current" },
];

export const platformArray = [
  { value: "gsa", label: "Illumina Global Screening" },
  { value: "oncoArray", label: "Illumina OncoArray" },
  { value: "Axiom", label: "Axiom" },
  { value: "BiLEVE", label: "BiLEVE" },
];

export const ifCancer = [
  { value: "1", label: "Yes" },
  { value: "0", label: "No" },
];

