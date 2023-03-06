// BarChart.js
import * as d3 from 'd3';
import { group } from 'd3';
import React, { useRef, useEffect } from 'react';

function SingleChart( props ){
    const ref = useRef();
    const typeColor = ((colorArr)=>{
      console.log(colorArr)
      if (colorArr[2] == 0 && colorArr[3]  && colorArr[4]== 0)
        return ["white","green"]
      else if(colorArr[0] == 0 && colorArr[3]  && colorArr[4]== 0)
        return ["white","blue"]
      else if (colorArr[0] == 0 && colorArr[1]  && colorArr[4]== 0)
      return ["white","red"]
      else if (colorArr[1] == 0 && colorArr[2]  && colorArr[3]== 0)
      return ["white","grey"]
      else 
        return ["white","green"]
    })
    
    useEffect(() => {
      const data = props.data;
      const width = 600;
      const height = 400;
      const margin = {top:20,right:20,bottom:30,left:40}
      const chartWidth = width - margin.left -margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const svg = d3.select(ref.current);

      const y = d3.scaleBand()
        .range([0, height])
        .padding(0.1);
      const x = d3.scaleLinear()
        .range([0, width]);
      const z = d3.scaleOrdinal()
        .range([0.25, 0.5, 0.75, 1]);
      const group = d3.scaleOrdinal()
        .range([
        
          { value: "none", end: "green", type: "green"},
          { value: "none", end: "red", type: "red" },
          { value: "none", end: "blue", type: "steelblue" },
           { value: "none", end: "grey", type: "grey" }
        ]);

{   const keys = ["value","end","type"]
    console.log(data,keys)
    y.domain(data.map(d => d.name));
    x.domain([0, d3.max(data, d => d.value+d.end)]).nice();
    z.domain(keys);
    group.domain(data.map(d => d.type));

    svg.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .each(function(e) {
        d3.select(this)
          .selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("y", d => y(d.data.name))
          .attr("x", d => x(d[0]))
          .attr("height", y.bandwidth())
          .attr("width", d => x(d[1])-x(d[0]) )
          .attr("fill", d => group(d.data.type)[e.key]);
      });
      

    svg.append("g")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }

     },[]);
    return (
      <div >
       <svg ref={ref} width={props.width} height={props.height}></svg>
      </div>
    )

}

export default SingleChart;