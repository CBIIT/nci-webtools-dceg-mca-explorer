import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";
import * as htmlToImage from "html-to-image";
import GenePlot from "./GenePlot";
import SnpPlot from "./SnpPlot";
import { Button } from "react-bootstrap";
import "./css/circos.css";
import { Row } from "react-bootstrap";

function SingleChromosome(props) {
  //console.log(props.data);
  const ref = useRef(null);
  const [layout, setLayout] = useState({
    //title:"Chromosome "+ props.chromesomeId,
    barmode: "stack",
    width: props.width,
    height: props.height,
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
      dragmode: "select",
    },
    // dragmode: 'select',
    selectdirection: "h",
    showlegend: false, // turn off the legend icon
    autosize: false, // disable autosize to fix the x-axis zoom issue
  });
  const [xMax, setXMax] = useState();
  const [xMin, setXMin] = useState();
  const [zoomHistory, setZoomHistory] = useState([]);
  const [init, setInit] = useState(true);

  useEffect(() => {
    if (zoomHistory.length > 0) {
      const currentView = zoomHistory.slice(-1).pop();
      //console.log(currentView);
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: { ...prevLayout.xaxis, range: [currentView["xaxis.range[0]"], currentView["xaxis.range[1]"]] },
        // yaxis: { ...prevLayout.yaxis, range: [currentView["yaxis.range[0]"], currentView["yaxis.range[1]"]] },
      }));

      setXMax(currentView["xaxis.range[1]"]);
      setXMin(currentView["xaxis.range[0]"]);
    }
  }, [zoomHistory]);
  function handleRelayout(event) {
    const { "xaxis.range[0]": xMin, "xaxis.range[1]": xMax } = event;
    setXMax(xMax);
    setXMin(xMin);
    //  setGeneLayout({ ...layout, xaxis: { ...xaxis, range } });
    if (event["xaxis.autorange"]) {
      setZoomHistory([]);
    } else {
      setZoomHistory((prevHistory) => [...prevHistory, event]);
    }
  }
  const handleZoomHistory = (event) => {
    if (zoomHistory.length > 1) {
      setZoomHistory((prevHistory) => prevHistory.slice(0, -1));
    } else {
      let resetBtn = null;
      if (props.title != undefined) {
        if (props.title.includes("A")) resetBtn = document.querySelectorAll('a[data-val*="reset"]')[0];
        else resetBtn = document.querySelectorAll('a[data-val*="reset"]')[1];
      } else {
        resetBtn = document.querySelectorAll('a[data-val*="reset"]')[0];
      }

      resetBtn.click();
    }
  };
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
          "<br>SampleId: " +
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
  const handleDownload = () => {
    //console.log(ref.current)
    htmlToImage
      .toPng(ref.current, { quality: 0.95, backgroundColor: "white" })
      .then((dataUrl) => {
        var link = document.createElement("a");
        link.download = "chromosome.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

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
    setLayout({
      ...layout,
      // title: props.title,
    });
    // async e => {
    //    // draw genes if zoom is at less than 50 MB
    //   //setGenes([]);
    //   //ref.current.drawGenes([]);
    //   // let zoomRange = Math.abs(xAxis.extent[1] - xAxis.extent[0]);
    //   // if (zoomRange <= 2e6) {
    //   //   let genes = await query('genes', {
    //   //     chromosome: selectedChromosome,
    //   //     transcription_start: xAxis.extent[0],
    //   //     transcription_end: xAxis.extent[1]
    //   //   });
    //   //   ref.current.drawGenes(genes);
    //   //   setGenes(genes);
    //   // }
    // }
  }, [props.chromesomeId, props.title]);

  return (
    <>
      <div id="plotly-div" className="" style={{ justifyContent: "center" }}>
        {props.title}
        {props.title && <br></br>}
        <Button id="zoomBack" variant="link" onClick={handleZoomHistory}>
          {zoomHistory.length > 0 ? "Back to previous view" : ""}
        </Button>
        <Plot
          data={data}
          layout={layout}
          //  onInitialized={handleInitialized}
          config={{
            ...defaultConfig,
            toImageButtonOptions: {
              ...defaultConfig.toImageButtonOptions,
              filename: "Chromosome " + props.chromesomeId,
            },
          }}
          //useResizeHandler
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
        <div style={{ whiteSpace: "pre-line" }}>{props.details}</div>
        <br />
        {xMax - xMin < 5000000 ? (
          <div>
            {xMax - xMin < 5000000 ? (
              <SnpPlot
                width={props.width}
                xMax={xMax}
                xMin={xMin}
                chr={props.chromesomeId}
                onHeightChange={props.onHeightChange}></SnpPlot>
            ) : (
              ""
            )}
            <br></br>
            <GenePlot
              width={props.width}
              xMax={xMax}
              xMin={xMin}
              chr={props.chromesomeId}
              onHeightChange={props.onHeightChange}
              onCompareHeightChange={props.onCompareHeightChange}></GenePlot>
            <br></br>
          </div>
        ) : (
          !props.title && (
            <p style={{ fontSize: "14px" }}>
              Gene and SNP plot are not available at the current zoom level.<br></br>
              Please zoom in to a 5MB range to see genes and SNPs.
            </p>
          )
        )}
        {xMin
          ? "Chr" +
            props.chromesomeId +
            ": " +
            Math.trunc(xMin).toLocaleString("en-US", { style: "decimal" }) +
            " -- " +
            Math.trunc(xMax).toLocaleString("en-US", { style: "decimal" })
          : ""}
      </div>
    </>
  );
}

export default SingleChromosome;
