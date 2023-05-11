import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import axios from "axios";
import Spinner from 'react-bootstrap/Spinner';

const data = [{
  x:[128000000,128000000],
  y:[0,10],
  type:'scatter',
  mode:'lines',
},
{
  x:[129000000,129000000],
  y:[0,10],
  type:'scatter',
  mode:'lines',
}];
function SnpPlot(props) {
 const [showSnp, setShowSnp] = useState(true);
 const [isLoading, setIsLoading] = useState(true);
 const snparr = []
 const snpPlotHeight = 100
 //console.log(props.xMax,props.xMin)
  useEffect(() => {
  
  }, [props.xMin]);

  async function handleQuery() {
    //setLoading(true)
    const query= {"xMin":props.xMin,"xMax":props.xMax,"chr":props.chr}
    const response = await axios.post("api/opensearch/snp", { search: query })
    const results = response.data
    //console.log("genes:",query)
   
    results.forEach(r=>{
      if (r._source !== null){
        const g = r._source
     
       
      }
    })
    
    //setSnp(snparr)
    if (snparr.length > 0){
       setShowSnp(true)
       setIsLoading(false)
    }
    else{
       setShowSnp(false)
       setIsLoading(false)
    }
    console.log(snparr)
  }
 
  //props.onHeightChange(snpPlotHeight)
 

  const layout = {
   xaxis: {
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      fixedrange:true,
      title:"Snp"
    },
    height: snpPlotHeight,
    width:props.width,
    showlegend: false, // turn off the legend icon
    autosize: true, // disable autosize to fix the x-axis zoom issue
    //annotations:annotation,
    margin: { l: 20, r: 20, t: 5, b: 30 },
    
  };

 
  return (
    // !showSnp && isLoading ?  
    // <Spinner animation="border" role="status">
    //   <span className="visually-hidden">Loading...</span>
    // </Spinner> : !isLoading && showSnp ?
    <div>
    <Plot 
      data={data}
      layout={layout}
      style={{ width: '100%', height: '100%',display:'block' }} 
    />
    </div>
  )
}

export default SnpPlot;

