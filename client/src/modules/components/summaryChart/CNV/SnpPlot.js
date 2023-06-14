import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function SnpPlot(props) {
  const [showSnp, setShowSnp] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [snps, setSnps] = useState([]);
  const snparr = [];
  const snpPlotHeight = 100;
  //console.log(props.xMax,props.xMin)
  useEffect(() => {
    if (true) {
      handleQuery();
    } else {
    }
  }, [props.xMin]);

  async function handleQuery() {
    //setLoading(true)
    const query = { xMin: props.xMin, xMax: props.xMax, chr: props.chr };
    const response = await axios.post("api/opensearch/snpchip", { search: query });
    const results = response.data;
    //console.log("snps:", results);

    results.forEach((r) => {
      if (r._source !== null) {
        const g = r._source;
        const temp_pos = {};
        temp_pos.x = [g.grch38, g.grch38];
        temp_pos.y = [0, 10];
        temp_pos.type = "scatter";
        temp_pos.mode = "lines";
        temp_pos.line = { color: "grey", width: 1 };
        snparr.push(temp_pos);
      }
    });

    setSnps(snparr);
    if (snparr.length > 0) {
      setShowSnp(true);
      setIsLoading(false);
    } else {
      setShowSnp(false);
      setIsLoading(false);
    }
    //console.log(snparr);
  }

  //props.onHeightChange(snpPlotHeight)

  const layout = {
    xaxis: {},
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      fixedrange: true,
      title: "Snp",
    },
    height: snpPlotHeight,
    width: props.width,
    showlegend: false, // turn off the legend icon
    autosize: true, // disable autosize to fix the x-axis zoom issue
    //annotations:annotation,
    margin: { l: 20, r: 20, t: 5, b: 30 },
  };

  return !showSnp && isLoading ? (
    <>
      {" "}
      Loading Gene ...
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  ) : !isLoading && showSnp ? (
    <div>
      <Plot data={snps} layout={layout} style={{ width: "100%", height: "100%", display: "block" }} />
    </div>
  ) : (
    <>
      Loading SNP ...
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </>
  );
}

export default SnpPlot;
