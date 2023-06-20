import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

export default function Legend(props) {
  const xp = 10;
  const yp = 10;
  const xw = 8;
  const xx = 8;
  const yy = 0;

  return (
    <div className="legendContainer">
      <svg
        version="1.1"
        baseProfile="full"
        className="legendClass"
        width="100%"
        height="50"
        xlmns="http://www/w3/org/2000/svg">
        <rect x={yp} y={0} fill="green" width={xw} height={yp} />
        <rect x={5 * yp} y={0} fill="blue" width={xw} height={yp} />
        <rect x={10 * yp} y={0} fill="red" width={xw} height={yp} />
        <rect x={14 * yp} y={0} fill="#ABABAB" width={xw} height={yp} />
        <text style={{ fontSize: 10 }} textAnchor="right" x={yp + 10} y={xx}>
          Gain
        </text>
        {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
        <text style={{ fontSize: 10 }} textAnchor="right" x={5 * yp + 10} y={xx}>
          Neutral
        </text>
        {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
        <text style={{ fontSize: 10 }} textAnchor="right" x={10 * yp + 10} y={xx}>
          Loss
        </text>
        <text style={{ fontSize: 10 }} textAnchor="right" x={15 * yp} y={xx}>
          Undetermined
        </text>
        {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
      </svg>
    </div>
  );
}
