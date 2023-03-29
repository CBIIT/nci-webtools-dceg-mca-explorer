import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as htmlToImage from "html-to-image";

const layout = {
  barmode: 'stack',
  width: 800,
  height: 700,
  margin: { l: 40, r: 20, t: 40, b: 20 },
  xaxis: { fixedrange: false },
  yaxis: { fixedrange: false, visible: false },
  dragmode: 'select',
  selectdirection: 'h',
  showlegend: false, // turn off the legend icon
  autosize: true, // disable autosize to fix the x-axis zoom issue
};
function SingleChromosome(props) {
  //console.log(props.chromesomeId, props.data)

    const ref = useRef();
 const [layoutState, setLayoutState] = useState(layout);
 var data1 = []
 var data2 = []
 var ydata = []
 var types = []

 props.data.sort((a, b) =>
      a.type === b.type
        ? a.start === b.start
          ? a.length === b.length
            ? a.end - b.end
            : b.length - a.length
          : a.start - b.start
        : a.type - b.type
    );
 props.data.forEach((element,index) => {
    data1.push(element.start)
    data2.push(element.length)
    types.push(element.type)
    ydata.push(index)
 });
 const data = [
  { x:data1,
    y:ydata,
    name: '',
    orientation: 'h',
    type: 'bar',
    marker:{
      color:"white"
    }
  },
    { 
      x:data2,
      y:ydata,
      name: '',
      orientation: 'h',
      type: 'bar',
      marker:{
        color:(types.map(t=>{
          if (t === "Loss") return "red"
          else if(t === "Gain") return "green"
          else if(t === "CN-LOH") return "blue"
          else return "grey"
        }))
      }}
 ]
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

   useEffect(() => {
    const updateLayout = (eventData) => {
      const updatedLayout = {
        ...layoutState,
        xaxis: { ...layoutState.xaxis, range: eventData.range },
        config:{
            displayModeBar: true,
        }
      };
      setLayoutState(updatedLayout);
    };

    const removeSelection = () => {
      const updatedLayout = {
        ...layoutState,
        xaxis: { ...layoutState.xaxis, range: null }
      };
      setLayoutState(updatedLayout);
    };
  }, [layoutState,props]);

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
        modeBarButtonsToRemove: ["select2d", "lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
    };
  return (
    <div>
      <div className="mx-5">
        <a href="javascript:void(0)" onClick={handleDownload} style={{ float: "right", justifyContent: "flex-end" }}>
          Download
        </a>
      </div>
      <div id="plotly-div">
      <Plot
      data={data}
      layout={layout}
      //  onInitialized={handleInitialized}
       config={{
                ...defaultConfig,
                toImageButtonOptions: {
                ...defaultConfig.toImageButtonOptions,
                filename: "All_Chromosomes"
                  },
           }}
        useResizeHandler
          style={{ width: '100%', height: '100%' }} 
     />
    </div>
    </div>
  );
}

export default SingleChromosome;
