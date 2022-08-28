
export const schema = [
  {
    name: "sample",
    schema: (table) => {
      table.increments("id");
      table.string("dataset");
      table.string("sampleId");
      table.string("computedGender");
      table.string("chromosome");
      table.integer("beginGrch38");
      table.integer("endGrch38");
      table.integer("length");
      table.string("pArm");
      table.string("qArm");
      table.integer("nSites");
      table.integer("nHets");
      table.integer("n50Hets");
      table.double("bdev");
      table.double("bdevSe");
      table.double("relCov");
      table.double("relCovSe");
      table.double("lodLrrBaf");
      table.double("lodBafPhase");
      table.integer("nFlips");
      table.double("bafConc");
      table.double("lodBafConc");
      table.string("type");
      table.double("cf");
      table.string("group");
      table.string("srSubjectId");
      table.string("limsIndividualId");
      table.string("project");
      table.string("limsSampleId");
      table.string("expectedSex");
      table.string("predictedSex");
      table.boolean("sexMatch");
      table.double("afr");
      table.double("eur");
      table.double("asn");
      table.string("ancestry");
      table.string("callRate1");
      table.boolean("sexDiscordant");
      table.boolean("expectedReplicateDiscordance");
      table.boolean("unexpectedReplicate");
      table.boolean("mochaAutosomal");
      table.string("plcoId");
      table.string("bloodBuccal");
      table.double("callRate");
      table.double("bafAuto");
      table.index(["dataset", "sampleId"]);
    },
  },
];
