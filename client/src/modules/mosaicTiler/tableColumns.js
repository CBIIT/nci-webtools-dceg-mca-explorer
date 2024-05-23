import { OverlayTrigger, Tooltip } from "react-bootstrap";

export const Columns = [
  {
    accessor: "sampleId",
    id: "sampleId",
    label: "sampleId",
    Header: <b>Sample ID</b>,
  },
  {
    accessor: "dataset",
    id: "dataset",
    label: "Dataset",
    Header: <b>Dataset</b>,
  },
  {
    accessor: "block_id",
    id: "chromosome",
    label: "Chromosome",
    Header: <b>Chromosome</b>,
  },
  {
    accessor: "type",
    id: "type",
    label: "Type",
    Header: <b>Type</b>,
  },
  {
    accessor: "value",
    id: "value",
    label: "value",
    Header: <b>Cellular Fraction</b>,
  },
  {
    accessor: "start",
    id: "start",
    label: "Start",
    Header: (
      <OverlayTrigger overlay={<Tooltip id="start_position">Event Start Position</Tooltip>}>
        <b>Start</b>
      </OverlayTrigger>
    ),
  },
  {
    accessor: "end",
    id: "end",
    label: "End",
    Header: (
      <OverlayTrigger overlay={<Tooltip id="end_position">Event End Position</Tooltip>}>
        <b>End</b>
      </OverlayTrigger>
    ),
  },
  {
    accessor: "PopID",
    id: "ancestry",
    label: "Ancestry",
    Header: <b>Ancestry</b>,
  },
  {
    accessor: "sex",
    id: "sex",
    label: "Sex",
    Header: <b>Sex</b>,
  },
  {
    accessor: "age",
    id: "age",
    label: "Age",
    Header: <b>Age</b>,
  },
  {
    accessor: "array",
    id: "array",
    label: "Array",
    Header: <b>Array</b>,
  },
  {
    accessor: "smokeNFC",
    id: "smoke",
    label: "Smoke",
    Header: <b>Smoke</b>,
  },
  {
    accessor: "priorCancer",
    id: "priorCancer",
    label: "Prior Cancer",
    Header: <b>Prior Cancer</b>,
  },
  {
    accessor: "incidentCancerHem",
    id: "incidentCancerHem",
    label: "Incident Hematological Cancer",
    Header: <b>Hematological Cancer</b>,
  },
  {
    accessor: "incidentCancerLymphoid",
    id: "incidentCancerLymphoid",
    label: "Incident Lymphoid Cancer",
    Header: <b>Lymphoid Cancer</b>,
  },
  {
    accessor: "incidentCancerMyeloid",
    id: "incidentCancerMyeloid",
    label: "Incident Myeloid Cancer",
    Header: <b>Myeloid Cancer</b>,
  },
];

export function exportTable(tableData) {
  return [
    {
      columns: Columns.map((e) => {
        return { title: e.label === "value" ? "Cellular Fraction" : e.label, width: { wpx: 160 } };
      }),
      data: tableData.map((e) => {
        return [
          { value: e.sampleId },
          { value: e.dataset },
          { value: e.block_id },
          { value: e.type },
          { value: e.value },
          { value: e.start },
          { value: e.end },
          { value: e.PopID },
          { value: e.sex },
          { value: e.age },
          { value: e.array },
          { value: e.smokeNFC },
        ];
      }),
    },
  ];
}
