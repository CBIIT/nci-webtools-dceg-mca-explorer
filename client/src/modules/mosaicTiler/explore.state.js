import { atom, selector, selectorFamily } from "recoil";
import { query, post } from "../../services/query";
import { initialX, initialY } from "./constants";
export const loadingState = atom({
  key: "analysis.loadingState",
  default: false,
});
export const eventResults = selector({
  key: "eventResults",
  get: async ({ get }) => {
    const params = get(formState);
    if (!params) return null;
    var results = [];
    const { gainTemp, lohTemp, lossTemp, undeterTemp, chrXTemp, chrYTemp } = await getData(params);
    results.push({
      gainTemp,
      lohTemp,
      lossTemp,
      undeterTemp,
      chrXTemp,
      chrYTemp,
    });
    return results;
  },
});
//do db retrieve based on inputs
export async function getData(params) {
  var results;
  var summary;
  let gainTemp = [];
  let lossTemp = [];
  let lohTemp = [];
  let undeterTemp = [];
  //console.log(params, params.chrX);
  //console.log(params.chrX, params.chrY);
  if (params.chrX && params.chrY) {
    gainTemp = [...initialX, ...initialY];
    lossTemp = [...initialX, ...initialY];
    lohTemp = [...initialX, ...initialY];
    undeterTemp = [...initialX, ...initialY];
  }
  if (params.chrX && !params.chrY) {
    gainTemp = [...initialX];
    lossTemp = [...initialX];
    lohTemp = [...initialX];
    undeterTemp = [...initialX];
  }
  if (!params.chrX && params.chrY) {
    gainTemp = [...initialY];
    lossTemp = [...initialY];
    lohTemp = [...initialY];
    undeterTemp = [...initialY];
  }
  const chrXTemp = [];
  const chrYTemp = [];
  const study_value = params.study;
  let query_value = [];
  Array.isArray(study_value)
    ? (query_value = [...study_value, params.chrX ? { value: "X" } : "", params.chrY ? { value: "Y" } : ""])
    : (query_value = [study_value, params.chrX ? { value: "X" } : "", params.chrY ? { value: "Y" } : ""]);
  results = await post("api/opensearch/mca", {
    dataset: query_value,
    sex: params.sex,
    mincf: params.minFraction,
    maxcf: params.maxFraction,
    ancestry: params.ancestry,
    types: params.types,
  });
  results.forEach((r) => {
    if (r._source !== null) {
      const d = r._source;
      if (d.cf !== "nan") {
        d.block_id = d.chromosome.substring(3);
        d.value = d.cf;
        d.dataset = d.dataset.toUpperCase();
        d.start = d.beginGrch38;
        d.end = d.endGrch38;
        if (d.chromosome !== "chrX") {
          if (d.type === "Gain") gainTemp.push(d);
          else if (d.type === "CN-LOH") lohTemp.push(d);
          else if (d.type === "Loss") lossTemp.push(d);
          else if (d.type === "Undetermined") undeterTemp.push(d);
        }
        if (params.chrX && d.type === "mLOX") {
          chrXTemp.push(d);
        }
        if (params.chrY && d.type === "mLOY") {
          chrYTemp.push(d);
          d.block_id = "Y";
        }
      }
    }
  });
  return { gainTemp, lohTemp, lossTemp, undeterTemp, chrXTemp, chrYTemp };
}
export const defaultFormState = {
  openSidebar: true,
  study: [{ value: "plco", label: "PLCO" }],
  array: [],
  chrSingle: "",
  chromosome: Array.from({ length: 22 }, (_, i) => i + 1)
    .map((i) => {
      return { value: "chr" + i, label: i };
    })
    .concat({ value: "chrX", label: "X" })
    .concat({ value: "chrY", label: "Y" }),
  chrCompare: "",
  plotType: { value: "circos", label: "Whole chromosome" },
  submitted: false,
  chrX: false,
  chrY: false,
  types: [{ value: "all", label: "All Types" }],
  compare: false,
  minAge: "",
  maxAge: "",
  algorithm: [],
  ancestry: [],
  maxFraction: "",
  minFraction: "",
  sex: [],
  counterSubmitted: 0,
  counterCompare: 0,
  start: "",
  end: "",
  groupA: [],
  groupB: [],
};
export const resetFormState = {
  openSidebar: true,
  study: [{ value: "plco", label: "PLCO" }],
  array: [],
  chromosome: Array.from({ length: 22 }, (_, i) => i + 1)
    .map((i) => {
      return { value: "chr" + i, label: i };
    })
    .concat({ value: "chrX", label: "X" })
    .concat({ value: "chrY", label: "Y" }),
  chrCompare: "",
  chrSingle: "",
  plotType: { value: "circos", label: "Whole chromosome" },
  submitted: false,
  chrX: false,
  chrY: false,
  types: [],
  compare: false,
  minAge: "",
  maxAge: "",
  algorithm: [],
  ancestry: [],
  maxFraction: "",
  minFraction: "",
  sex: [],
  counterSubmitted: 0,
  counterCompare: 0,
  start: "",
  end: "",
  groupA: [],
  groupB: [],
};
export const formState = atom({
  key: "explore.formState",
  default: defaultFormState,
});
