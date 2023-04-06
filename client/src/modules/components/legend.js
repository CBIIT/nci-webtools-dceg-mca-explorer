import Spinner from "react-bootstrap/Spinner";
import classNames from "classnames";

export default function Legend(props) {
  const xp = 10;
  const yp = 10;
  const xw = 10;
  return (
    <div className="text-center">
      <svg version="1.1" baseProfile="full" width="700" height="100" xlmns="http://www/w3/org/2000/svg">
        <rect x={xp} y={0} fill="green" width={xw} height={yp} />
        <rect x={xp} y={2*yp} fill="blue" width={xw} height={yp} />
        <rect x={xp} y={4*yp} fill="red" width={xw} height={yp} />
        <rect x={xp} y={6*yp} fill="#ABABAB" width={xw} height={yp} />
        <text textAnchor="right" x={xp+30} y={yp+1}>
          GAIN
        </text>
        {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
        <text textAnchor="right" x={xp+30} y={yp+20}>
          NEUTRAL
        </text>
        {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
        <text textAnchor="right" x={xp+30} y={yp+40}>
          LOSS
        </text>
        <text textAnchor="right" x={xp+30} y={yp+60}>
          UNDETERMINED
        </text>
        {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
      </svg>
    </div>
  );
}
