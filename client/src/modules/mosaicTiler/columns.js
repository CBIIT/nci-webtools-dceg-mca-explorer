import { OverlayTrigger, Tooltip } from "react-bootstrap";
const columns = [
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
    accessor: "ancestry",
    id: "ancestry",
    label: "Ancestry",
    Header: <b>Ancestry</b>,
  },
  {
    accessor: "computedGender",
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
];

export default columns;
