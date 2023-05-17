import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

export default function Legend(props) {
  const xp = 10;
  const yp = 10;
  const xw = 10;
  const xx = 10;
  const yy = 400;
  return (
    <div className="text-center">
      <svg version="1.1" baseProfile="full" width="700" height="40" xlmns="http://www/w3/org/2000/svg">
        <rect y={xp + xx} x={0 + yy} fill="green" width={xw} height={yp} />
        <rect y={xp + xx} x={2 * yp + yy + 30} fill="blue" width={xw} height={yp} />
        <rect y={xp + xx} x={4 * yp + yy + 85} fill="red" width={xw} height={yp} />
        <rect y={xp + xx} x={6 * yp + yy + 120} fill="#ABABAB" width={xw} height={yp} />
        <text textAnchor="right" y={xp + xx + 10} x={yp + yy + 4}>
          Gain
        </text>
        {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
        <text textAnchor="right" y={xp + xx + 10} x={yp + yy + 55}>
          Neutral
        </text>
        {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
        <text textAnchor="right" y={xp + xx + 10} x={yp + yy + 130}>
          Loss
        </text>
        <text textAnchor="right" y={xp + xx + 10} x={yp + yy + 185}>
          Undetermined
        </text>
        {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
      </svg>
    </div>
  );
}
