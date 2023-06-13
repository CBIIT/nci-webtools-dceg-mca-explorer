import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

export default function Legend(props) {
  const xp = 10;
  const yp = 7;
  const xw = 8;
  const xx = 10;
  const yy = 0;

  return (
    <div className="legendContainer">
      <svg
        version="1.1"
        baseProfile="full"
        className="legendClass"
        width="100%"
        height="55"
        xlmns="http://www/w3/org/2000/svg">
        <rect y={yp} x={0} fill="green" width={xw} height={yp} />
        <rect y={3 * yp} x={0} fill="blue" width={xw} height={yp} />
        <rect y={5 * yp} x={0} fill="red" width={xw} height={yp} />
        <rect y={7 * yp - 1} x={0} fill="#ABABAB" width={xw} height={yp} />
        <text style={{ fontSize: 10 }} textAnchor="right" y={yp + 7} x={xx}>
          Gain
        </text>
        {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
        <text style={{ fontSize: 10 }} textAnchor="right" y={yp + 20} x={xx}>
          Neutral
        </text>
        {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
        <text style={{ fontSize: 10 }} textAnchor="right" y={yp + 35} x={xx}>
          Loss
        </text>
        <text style={{ fontSize: 10 }} textAnchor="right" y={yp + 48} x={xx}>
          Undetermined
        </text>
        {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
      </svg>
    </div>
  );
}
