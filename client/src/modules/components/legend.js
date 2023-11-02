export default function Legend(props) {
  const xp = 10;
  const yp = 10;
  const xw = 8;
  const xx = 8;
  const yy = 10;

  return (
    <div className="" style={{ alignItems: "top", paddingTop: "3px" }}>
      <svg
        version="1.1"
        baseProfile="full"
        className="legendClass"
        width="220"
        height="30"
        xlmns="http://www/w3/org/2000/svg">
        <rect x={yp} y={0} fill="green" width={xw} height={yy} />
        <rect x={5 * yp} y={0} fill="blue" width={xw} height={yy} />
        <rect x={10 * yp} y={0} fill="red" width={xw} height={yy} />
        <rect x={14 * yp} y={0} fill="#ABABAB" width={xw} height={yy} />
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
