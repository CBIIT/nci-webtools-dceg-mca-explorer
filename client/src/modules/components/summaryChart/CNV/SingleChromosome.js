import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";
import GenePlot from "./GenePlot";
import SnpPlot from "./SnpPlot";
import { Button } from "react-bootstrap";
import "./css/circos.css";

const zoomWindow = 5000000;
function SingleChromosome(props) {
  //console.log(props.data);
  const ref = useRef(null);
  const [width, setWidth] = useState(props.width === undefined ? props.size : props.width);
  const [height, setHeight] = useState(props.width === undefined ? props.size : props.width);
  const sizeRef = useRef(width);
  const [layout, setLayout] = useState({
    //title:"Chromosome "+ props.chromesomeId,
    barmode: "stack",
    margin: { l: 10, r: 10, t: 30, b: 30 },
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
  const [data, setData] = useState([]);

  //update sizeRef when width changes
  useEffect(() => {
    sizeRef.current = width;
  }, [width]);

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
    console.log("zooming...", event, name);
    if (
      event !== undefined &&
      event.dragmode !== "zoom" &&
      event["autorange"] === undefined &&
      event["autosize"] === undefined &&
      event["xaxis.autorange"] === undefined &&
      event["xaxis.autosize"] === undefined
    ) {
      const { "xaxis.range[0]": xMin, "xaxis.range[1]": xMax } = event;
      setXMax(xMax);
      setXMin(xMin);
      //console.log(xMin, xMax);
      xMax - xMin < zoomWindow ? setLoading(true) : setLoading(false);
      //trigger synchronize another plot to zoom, make sue only trigger for one plot
      //difficient zoom in on single chromosome  or on comparison by name
      if (name === undefined) {
        if (
          event["autorange"] ||
          event["autosize"] ||
          event["xaxis.autorange"] ||
          event["xaxis.autosize"] === undefined
        ) {
          props.onZoomChange(event, props.details, event);
        }
      }
      if (event["xaxis.autorange"] !== undefined || event["xaxis.autosize"] !== undefined) {
        setZoomHistory([]);
      } else {
        setZoomHistory((prevHistory) => [...prevHistory, event]);
      }
    }
    if (event !== undefined && (event["xaxis.autorange"] || event["xaxis.autosize"])) {
      console.log("reset to initial", zoomHistory.length);
      setZoomHistory([]);
    }
    // if (event !== undefined) setZoomHistory([]);
  }
  const handleZoomHistory = (event) => {
    if (zoomHistory.length > 1) {
      setZoomHistory((prevHistory) => prevHistory.slice(0, -1));
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

  const handleResize = () => {
    const container = ref.current;
    if (props.size !== undefined && container) {
      //console.log(props.size, sizeRef.current, window.innerWidth);
      if (window.innerWidth > 980 && sizeRef.current < 700) {
        setWidth(800);
        setHeight(800);
      }
      if (window.innerWidth < 980 && sizeRef.current > 700) {
        setWidth(450);
        setHeight(450);
      }
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  var data1 = [];
  var data2 = [];
  var ydata = [];
  var types = [];

  props.data.sort((a, b) =>
    a.type === b.type ? (a.start === b.start ? b.end - a.end : a.start - b.start) : a.type.localeCompare(b.type)
  );
  console.log();
  let zoomeddata = props.data;

  // zoomeddata.forEach((element, index) => {
  //   data1.push(element.start);
  //   data2.push(element.length);
  //   types.push(element.type);
  //   ydata.push(index);
  // });

  useEffect(() => {
    // if (xMin !== undefined && xMax !== undefined)
    //   zoomeddata = props.data.filter(
    //     (d) => d.end < (xMin === undefined ? 0 : xMin) || d.start > (xMax === undefined ? 99999999999 : xMax)
    //   );
    const addeddata = props.data.length - zoomeddata.length;
    console.log();
    for (var i = 0; i < addeddata; i++) {
      zoomeddata.push("");
    }
    console.log(zoomeddata.length);
    zoomeddata.forEach((element, index) => {
      data1.push(element.start);
      data2.push(element.length);
      types.push(element.type);
      ydata.push(index);
    });
    const datatemp = [
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
    setData(datatemp);
  }, [xMin, xMax, props.data]);

  //console.log(data1, data2, ydata);

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
  let backtochr = "Chr" + props.chromesomeId + " ";
  let backtoprev = "";
  if (prev !== undefined && prev["xaxis.range[0]"] !== undefined) {
    const pxmin = prev["xaxis.range[0]"];
    const pxmax = prev["xaxis.range[1]"];
    //backtoprev += " (" + (pxmin / 1000000).toFixed(2) + " MB - " + (pxmax / 1000000).toFixed(2) + "MB)";
    backtoprev =
      "Chr" +
      props.chromesomeId +
      ":" +
      Math.trunc(pxmin).toLocaleString("en-US", { style: "decimal" }) +
      "-" +
      Math.trunc(pxmax).toLocaleString("en-US", { style: "decimal" });
  }
  let btnid = props.details !== undefined ? props.details : "";
  btnid = "zoomBack" + btnid;
  if (zoomHistory.length == 0) {
    backtoprev = "";
  }
  let rangeLable = xMin
    ? "Chr" +
      props.chromesomeId +
      ":" +
      Math.trunc(xMin).toLocaleString("en-US", { style: "decimal" }) +
      "-" +
      Math.trunc(xMax).toLocaleString("en-US", { style: "decimal" })
    : "";

  if (zoomHistory.length == 0) rangeLable = "";
  props.zoomHistory([backtoprev, rangeLable]);
  //console.log(zoomHistory);

  return (
    <>
      <div xs={12} md={6} lg={6} className="" style={{ justifyContent: "center", fontSize: "14px" }}>
        {props.title}
        {props.title && <br></br>}
        <Button id={btnid} variant="link" onClick={handleZoomHistory} aria-label="zoomBack">
          {/* {zoomHistory.length > 0 ? backtoprev : ""} */}
        </Button>
        <div id={props.details}>
          <Plot
            data={data}
            layout={{ ...layout, height }}
            //  onInitialized={handleInitialized}
            // layout={{ ...layout, height, width }}
            config={{
              ...defaultConfig,
              toImageButtonOptions: {
                ...defaultConfig.toImageButtonOptions,
                filename: "Chromosome " + props.chromesomeId,
              },
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%", position: "relative" }}
            ref={ref}
            onRelayout={handleRelayout}
            // onInitialized={() => {
            //   if (initX.length === 0) {
            //     console.log("set initial:", layout.xaxis.range);
            //     setInitX(layout.xaxis.range);
            //   }
            // }}
          />
        </div>
        {/* <div style={{ whiteSpace: "pre-line" }}>{props.details}</div> */}
        <br />
        {loading && xMax - xMin < zoomWindow && zoomHistory.length > 0 ? (
          <>
            <div id="snpplots">
              <SnpPlot
                width={width}
                xMax={xMax}
                xMin={xMin}
                chr={props.chromesomeId}
                //</div>onHeightChange={props.onHeightChange}
              ></SnpPlot>
            </div>
            <br></br>
            <div id="geneplots">
              <GenePlot
                width={width}
                xMax={xMax}
                xMin={xMin}
                chr={props.chromesomeId}
                //onHeightChange={props.onHeightChange}
                //</div>onCompareHeightChange={props.onCompareHeightChange}
              ></GenePlot>
            </div>
            <br></br>
          </>
        ) : (
          !props.title && (
            <p style={{ fontSize: "14px" }}>
              Gene and SNP plot are not available at the current zoom level.<br></br>
              Please zoom in to a 5MB range to see genes and SNPs.
            </p>
          )
        )}
        {xMin ? rangeLable : ""}
        {/* <ResolutionPlot></ResolutionPlot> */}
      </div>
    </>
  );
}

export default SingleChromosome;
