import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as htmlToImage from "html-to-image";
import Plotly from 'plotly.js-dist';

//  const data = [
//     {
//       x: [20, 14, 23],
//       y: ['giraffes', 'orangutans', 'monkeys'],
//       name: 'SF Zoo',
//       orientation: 'h',
//       type: 'bar'
//     },
//     {
//       x: [12, 18, 29],
//       y: ['giraffes', 'orangutans', 'monkeys'],
//       name: 'LA Zoo',
//       orientation: 'h',
//       type: 'bar'
//     }
//   ];

const layout = {
  barmode: 'stack',
  width: 750,
  height: 800,
  margin: { l: 40, r: 20, t: 40, b: 20 },
  xaxis: { fixedrange: false },
  yaxis: { fixedrange: false, visible: false },
  dragmode: 'select',
  selectdirection: 'h',
   showlegend: false // turn off the legend icon
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
        xaxis: { ...layoutState.xaxis, range: eventData.range }
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

    const plotlyElement = document.getElementById('plotly-div');
    Plotly.newPlot(plotlyElement, data, layoutState);
    plotlyElement.on('plotly_relayout', updateLayout);
    plotlyElement.on('plotly_doubleclick', removeSelection);

    return () => {
      plotlyElement.removeAllListeners();
    };
  }, [layoutState,props]);

  return (
    <div>
      <div className="mx-5">
        <a href="javascript:void(0)" onClick={handleDownload} style={{ float: "right", justifyContent: "flex-end" }}>
          Download
        </a>
      </div>
      <div id="plotly-div">
      {/* <Plot
      data={data}
      layout={layoutState}
      //  onInitialized={handleInitialized}
          style={{ width: '100%', height: '100%' }} 
     /> */}
    </div>
    </div>
  );
}

export default SingleChromosome;
