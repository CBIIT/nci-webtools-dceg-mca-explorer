import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";

import "./css/circos.css";

const zoomWindow = 5000000;
function SingleChromosomeTest(props) {
  const ref = useRef(null);
  const [layout, setLayout] = useState({
    //title:"Chromosome "+ props.chromesomeId,
    barmode: "stack",
    //width: props.width,
    //height: props.height,
    margin: { l: 10, r: 0, t: 30, b: 30 },
    xaxis: {
      title: "",
      showgrid: true,
      visible: true,
      showticklabels: true,
      zeroline: true,
      showline: true,
    },
    yaxis: {
      show: false,
      visible: false,
      title: "",
      showgrid: false,
      showticklabels: false,
      zeroline: false,
      showline: false,
      autorange: true,
      fixedrange: true,
      //dragmode: "select",
    },
    // dragmode: 'select',
    selectdirection: "h",
    showlegend: false, // turn off the legend icon
    autosize: true, // disable autosize to fix the x-axis zoom issue
  });
  const [xMax, setXMax] = useState();
  const [xMin, setXMin] = useState();
  const [zoomHistory, setZoomHistory] = useState([]);
  const [newRange, setNewRange] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (zoomHistory.length > 0) {
      const currentView = zoomHistory.slice(-1).pop();
      //console.log(props.details, currentView);
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: { ...prevLayout.xaxis, range: [currentView["xaxis.range[0]"], currentView["xaxis.range[1]"]] },
        // yaxis: { ...prevLayout.yaxis, range: [currentView["yaxis.range[0]"], currentView["yaxis.range[1]"]] },
      }));

      setXMax(currentView["xaxis.range[1]"]);
      setXMin(currentView["xaxis.range[0]"]);
    }
  }, [zoomHistory]);

  function handleRelayout(event, name) {
    // console.log("zooming...", event);
    if (event !== undefined && event.dragmode !== "zoom") {
      const { "xaxis.range[0]": xMin, "xaxis.range[1]": xMax } = event;
      setXMax(xMax);
      setXMin(xMin);
      //console.log(xMin, xMax);
      xMax - xMin < zoomWindow ? setLoading(true) : setLoading(false);

      //trigger synchronize another plot to zoom, make sue only trigger for one plot
      //difficient zoom in on single chromosome  or on comparison by name
      if (props.details !== undefined && name === undefined) {
        //if (props.zoomRange === null) {
        props.onZoomChange(event, props.details);
        //}
      }
      if (event["xaxis.autorange"]) {
        setZoomHistory([]);
      } else {
        setZoomHistory((prevHistory) => [...prevHistory, event]);
      }
    }
  }
  const handleZoomHistory = (event) => {
    if (zoomHistory.length > 1) {
      setZoomHistory((prevHistory) => prevHistory.slice(0, -1));
      // let bbutton = null;
      // if (props.details.includes("A")) {
      //   bbutton = document.getElementById("zoomBackB");
      //   bbutton.click();
      // }
      // if (props.details.includes("B")) {
      //   bbutton = document.getElementById("zoomBackA");
      //   bbutton.click();
      // }
    } else {
      if (props.details != undefined) {
        let resetBtnA = null;
        let resetBtnB = null;
        resetBtnA = document.querySelectorAll('a[data-val*="reset"]')[0];
        resetBtnB = document.querySelectorAll('a[data-val*="reset"]')[1];
        resetBtnA.click();
        resetBtnB.click();
      } else {
        let resetBtn = document.querySelectorAll('a[data-val*="reset"]')[0];
        resetBtn.click();
      }

      setNewRange([]);
      setZoomHistory([]);
    }
  };
  //synchronize the zoom range
  useEffect(() => {
    if (props.zoomRange !== undefined && props.zoomRange !== null) {
      //ref.current.props.on("plotly_relayout", handleRelayout);
      ref.current.props.onRelayout(handleRelayout(props.zoomRange, props.details));
      const new_range = [props.zoomRange["xaxis.range[0]"], props.zoomRange["xaxis.range[1]"]];
      setNewRange(new_range);
      // console.log("props.zoomRange", newRange, props.details);
    }
  }, [props.zoomRange]);
  var data1 = [];
  var data2 = [];
  var ydata = [];
  var types = [];

  props.data.sort((a, b) =>
    a.type === b.type ? (a.start === b.start ? b.end - a.end : a.start - b.start) : a.type.localeCompare(b.type)
  );
  //console.log(props.data);
  props.data.forEach((element, index) => {
    data1.push(element.start);
    data2.push(element.length);
    types.push(element.type);
    ydata.push(index);
  });
  const data = [
    {
      x: data1,
      y: ydata,
      name: "",
      orientation: "h",
      type: "bar",
      marker: {
        color: "white",
      },
    },
    {
      x: data2,
      y: ydata,
      name: "",
      orientation: "h",
      type: "bar",
      marker: {
        color: types.map((t) => {
          if (t === "Loss") return "red";
          else if (t === "Gain") return "green";
          else if (t === "CN-LOH") return "blue";
          else if (t === "Undetermined") return "#ABABAB";
          else return "red";
        }),
      },
      hovertext: props.data.map((e) => {
        var text =
          "Study: " +
          e.dataset +
          "<br>Sample ID: " +
          e.sampleId +
          "<br>Start: " +
          e.start +
          "<br>End: " +
          e.end +
          "<br>Type: " +
          e.type +
          "<br>Cellular Fraction:" +
          e.value +
          "<br>Ancestry: " +
          e.ancestry +
          "<br>Sex: " +
          e.computedGender +
          "<br>Age: " +
          e.age;
        return text;
      }),
      hovertemplate: "<br>%{hovertext} <extra></extra>",
    },
  ];
  //console.log(data,types)

  const defaultConfig = {
    displayModeBar: true,
    toImageButtonOptions: {
      format: "svg",
      filename: "plot_export",
      height: 1000,
      width: 1000,
      scale: 1,
    },
    displaylogo: false,
    responsive: true,
    modeBarButtonsToRemove: ["select2d", "lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
  };

  useEffect(() => {
    const nlayout = { ...layout };
    setLayout({
      nlayout,
    });
    if (newRange) {
      const synlayout = {
        ...nlayout,
        xaxis: { range: newRange },
      };
      setLayout(synlayout);
      //console.log(props.details, synlayout, newRange);
    }
    //console.log(props.title, zoomHistory);
  }, [props.chromesomeId, props.title, newRange]);

  useEffect(() => {
    //console.log(layout, props.details);
    if (data.length === 0) {
      setZoomHistory([]);
    }
  }, [data]);

  const prev = zoomHistory[zoomHistory.length - 2];
  let backtoprev = "Back to initial";
  if (prev != undefined) {
    const pxmin = prev["xaxis.range[0]"];
    const pxmax = prev["xaxis.range[1]"];
    backtoprev = "Back to " + (pxmin / 1000000).toFixed(2) + "M - " + (pxmax / 1000000).toFixed(2) + "M";
  }
  return (
    <div>
      <Plot data={data} layout={layout} useResizeHandler={true} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default SingleChromosomeTest;
