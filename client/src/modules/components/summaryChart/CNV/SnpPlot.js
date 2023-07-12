import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

function SnpPlot(props) {
  const [showSnp, setShowSnp] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [snps, setSnps] = useState([]);
  const snpwidth = Math.round(props.width);
  const snparr = [];

  const snpPlotHeight = 100;
  //console.log(props.xMax, props.xMin);
  //
  const unit = Math.round((props.xMax - props.xMin) / snpwidth);
  const bucketRange = Array(snpwidth).fill(0);

  for (let i = 0; i < snpwidth; i++) {
    const p = i * unit;
    bucketRange[i] = { from: p + Math.floor(props.xMin), to: p + unit + Math.floor(props.xMin) };
    const s = {
      x: [props.xMin, props.xMin],
      y: [0, 10],
      type: "scatter",
      mode: "lines",
      line: { color: "grey", width: 1 },
    };
    snparr.push(s);
  }
  //console.log(snparr);
  useEffect(() => {
    if (true) {
      handleQuery();
    } else {
    }
  }, [props.xMax]);

  async function handleQuery() {
    //setLoading(true)
    const query = { chr: props.chr, bucketRange };
    const response = await axios.post("api/opensearch/snpchip", { search: query });
    const results = response.data;
    //console.log("snps:", results);

    for (let i = 0; i < results.length; i++) {
      const res = results[i];
      const sp = snparr[i];
      //console.log(res);
      if (res.doc_count > 0) {
        sp.x = [res.from, res.from];
      }
    }
    setSnps(snparr);
    if (snparr.length > 0) {
      setShowSnp(true);
      setIsLoading(false);
    } else {
      setShowSnp(false);
      setIsLoading(false);
    }
    // console.log(snparr);
  }

  //props.onHeightChange(snpPlotHeight)

  const layout = {
    xaxis: {},
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      fixedrange: true,
      title: "SNP",
    },
    height: snpPlotHeight,
    width: props.width,
    showlegend: false, // turn off the legend icon
    autosize: true, // disable autosize to fix the x-axis zoom issue
    //annotations:annotation,
    margin: { l: 20, r: 20, t: 5, b: 30 },
  };

  return showSnp && isLoading ? (
    <>
      Loading SNP ...
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
      {/* Loading SNP ...
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner> */}
    </>
  );
}

export default SnpPlot;
