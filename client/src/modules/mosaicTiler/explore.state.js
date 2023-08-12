import { atom, selector, selectorFamily } from "recoil";
import { query } from "../../services/query";

export const loadingState = atom({
  key: "analysis.loadingState",
  default: false,
});

export const sampleState = selector({
  key: "explore.sampleState",
  get: ({ get }) =>
    query("api/query", {
      table: "sample",
      orderBy: "id",
      order: "asc",
    }),
});

export async function getData(params, tumor, gene) {
  var summary;
  var participants;

  participants = await query("api/query", {
    "table": params.dataset.value,
    "_cancerId:in": tumor,
    "_geneId": gene,
  });

  return { summary, participants };
}

export const resultsState = selector({
  key: "results",
  get: async ({ get }) => {
    const params = get(formState);
    if (!params) return null;

    var results = [];
    console.log("params:", params);

    //Get Data Function Here, return array of json documents

    results.map((e) => {
      var chromosome = e.chromosome.slice(3);

      if (chromosome === "X") chromosome = 23;

      return {
        ...e,
        chromosome: chromosome,
        sexMatch: e.sexMatch === 1 ? "Y" : "N",
        sexDiscordant: e.sexDiscordant === 1 ? true : false,
        unexpectedReplicate: e.unexpectedReplicate === 1 ? true : false,
        mochaAutosomal: e.mochaAutosomal === 1 ? true : false,
      };
    });

    // console.log(results);
    return results;
  },
});

export const defaultFormState = {
  openSidebar: true,
  study: { value: "plco", label: "PLCO" },
  array: [],
  chromosome: Array.from({ length: 22 }, (_, i) => i + 1)
    .map((i) => {
      return { value: "chr" + i, label: i };
    })
    .concat({ value: "chrX", label: "X" })
    .concat({ value: "chrY", label: "Y" }),
  plotType: { value: "circos", label: "Circos" },
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
  study: { value: "plco", label: "PLCO" },
  array: [],
  chromosome: Array.from({ length: 22 }, (_, i) => i + 1)
    .map((i) => {
      return { value: "chr" + i, label: i };
    })
    .concat({ value: "chrX", label: "X" })
    .concat({ value: "chrY", label: "Y" }),
  plotType: { value: "circos", label: "Circos" },
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
