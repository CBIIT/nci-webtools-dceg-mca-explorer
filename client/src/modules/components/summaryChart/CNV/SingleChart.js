// BarChart.js
import * as d3 from 'd3';
import { group } from 'd3';
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
      svg.selectAll("*").remove();

      const y = d3.scaleBand()
        .range([0, height])
        .padding(0.1);
      const x = d3.scaleLinear()
        .range([0, width]);
      const z = d3.scaleOrdinal()
        .range([0.25, 0.5, 0.75, 1]);
      const group = d3.scaleOrdinal()
        .range([
          { start: "white", length: "green", type: "green"},
          { start: "white", length: "blue", type: "blue" },
          { start: "white", length: "red", type: "red" },
           { start: "white", length: "grey", type: "grey" }
        ]);

        const tooltip = ({x,y,info}) => {
          return (
            <div className='tooltip' style={{left:x, top:y}}>
              <p>{info.key}</p>
              <p>{info.value}</p>
            </div>
          )
        }
      

{   const keys = ["start","length","type"]
    console.log(data,keys)
    y.domain(data.map(d => d.ypos));
    x.domain([0, d3.max(data, d => d.end)]).nice();
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
          .attr("y", d => y(d.data.ypos))
          .attr("x", d => x(d[0]))
          .attr("height", y.bandwidth())
          .attr("width", d => x(d[1]) )
          .attr("fill", d => group(d.data.type)[e.key])
          ;
      })
      .on("mouseover", function(d) {
        //console.log(d); 
        // tooltip.style("display", null); 
        // tooltip.select("text").text(d.y);
       })
      .on("mouseout", function() { 
        //tooltip.style("display", "none"); 
      })
       .on("mousemove", function(d) {
        // var xPosition = d.mouseEvent.x - 15;
        // var yPosition = d.mouseEvent.y - 25;
        // tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        // tooltip.select("text").text(d.y);
        });
    ;
      

    svg.append("g")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }
     },[props]);
    return (
      <div >
        <div>Chromosome {props.chromesomeId}</div>
       <svg ref={ref} width={props.width} height={props.height}></svg>
      </div>
    )

}

export default SingleChart;