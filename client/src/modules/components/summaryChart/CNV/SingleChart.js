// BarChart.js
import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function SingleChart( props ){
    const ref = useRef();
    
    useEffect(() => {
      const data = props.data;
      const width = 600;
      const height = 400;
      const margin = {top:20,right:20,bottom:30,left:40}
      const chartWidth = width - margin.left -margin.right;
      const chartHeight = height - margin.top - margin.bottom;

      const svg = d3.select(ref.current);
            // .attr("width", width)
            // .attr("height", height)
            // .style("border", "1px solid black")
    const colorScale = d3.scaleOrdinal().domain(data.map(d=>d.color)).range(d3.schemeCategory10);
  
    const y = d3.scaleBand().domain(data.map(d => d.name))
    .range([chartHeight,0]).padding(0.1);

    const x = d3.scaleLinear()
    .domain([0,d3.max(data, d=>d.total)])
    .range([0,chartWidth]);

    svg
    .append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`)
    .selectAll("g")
    .data(d3.stack().keys(["value"])(data))
    .join("g")
    .attr("fill",d=>colorScale(d.color))
    .selectAll("rect")
    .data(d=>d)
    .join("rect")
    .attr('x', d=> x(d[0]))
    .attr('y',d => y(d.data.name))
    .attr('width',d=>x(d[1])-x(d[0]))
    .attr('height',y.bandwidth());
  },[props.data]);


    return (
      <div >
       <svg ref={ref} width={props.width} height={props.height}></svg>
      </div>
    )

}

export default SingleChart;