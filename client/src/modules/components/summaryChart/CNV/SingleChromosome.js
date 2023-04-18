import React, { useEffect, useState, useRef } from 'react';
import Plot from 'react-plotly.js';
import * as htmlToImage from "html-to-image";
import GenePlot from './GenePlot';

function SingleChromosome(props) {
 // console.log(props.chromesomeId, props.data)
 const ref = useRef();
 const [layout, setLayout] = useState({
  title:"Chromosome "+ props.chromesomeId,
  barmode: 'stack',
  width: props.width,
  height: props.height,
  margin: { l: 40, r: 20, t: 40, b: 30 },
  xaxis: {  title:'', showgrid: true,visible:true,showticklabels: true,  zeroline:true, showline: true,},
  yaxis: { show:false, visible: false,  title: '', showgrid: false, showticklabels: false, zeroline:false, showline: false,},
 // dragmode: 'select',
  selectdirection: 'h',
  showlegend: false, // turn off the legend icon
  autosize: false, // disable autosize to fix the x-axis zoom issue
  });
 const [xMax, setXMax] = useState(); 
 const [xMin, setXMin] = useState(); 

  function handleRelayout(event) {
   const { 'xaxis.range[0]': xMin, 'xaxis.range[1]': xMax } = event;
   setXMax(xMax);
   setXMin(xMin);
  //  setGeneLayout({ ...layout, xaxis: { ...xaxis, range } });

  }
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
          else return "#ABABAB"
        }))
      },
       hovertext: props.data.map((e) => {
          var text = "Study: " +
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
                  e.sex +
                  "<br>Age: " +
                  e.age
          return text
      }),
      hovertemplate: "<br>%{hovertext} <extra></extra>",
    }
     
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

    useEffect(()=>{
      setLayout({
        ...layout,
        title:"Chromosome "+ props.chromesomeId
      })
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
    },[props.chromesomeId])
  
  return (
    <div>
      <div className="mx-5">
        {/* <a href="javascript:void(0)" onClick={handleDownload} style={{ float: "right", justifyContent: "flex-end" }}>
          Download
        </a> */}
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
                filename: "Chromosome "+props.chromesomeId
              },
           }}
       // useResizeHandler
        style={{ width: '100%', height: '100%' }} 
        ref={ref}
        onRelayout={handleRelayout}
     />
     {xMax-xMin<2000000?
      <GenePlot width={props.width} xMax={xMax} xMin={xMin} chr={props.chromesomeId}></GenePlot>:''}
    </div>
    </div>
  );
}

export default SingleChromosome;
