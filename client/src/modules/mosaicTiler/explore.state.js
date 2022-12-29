import { atom, selector, selectorFamily } from "recoil";
import { query } from "../../services/query";

export const sampleState = selector({
  key: "explore.fieldState",
  get: ({ get }) => query("api/query", { table: "sample",
     orderBy: "name",
      order: "asc", })
});


export async function getData(params, tumor, gene) {
  var summary;
  var participants
 
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
    console.log("params:",params);

    for (const gene of [params.gene, params.correlatedGene]) {
      if (!gene) continue;

      const { summary, participants} = await getData(
        params,
        params.cancer.map((e) => e.value),
        gene.value,
      );
      results.push({
        gene,
        summary,
        participants      
      });
    }
   // console.log(results);
    return results;
  },
});

export const geneState = selector({
  key: "explore.geneState",
  get: ({ get }) => query("api/query", { table: "geneName" }),
});

export const dataState = selectorFamily({
  key: "explore.proteinData",
  get:
    ({ table, cancer, gene }) =>
    async (_) =>
      table && cancer && gene
        ? query("api/query", {
            "table": table,
            "_cancerId:in": cancer,
            "_geneId": gene,
          })
        : [],
});

export const defaultFormState = {
  openSidebar: true,

  submitted: false,
};

export const formState = atom({
  key: "explore.formState",
  default: defaultFormState,
});
