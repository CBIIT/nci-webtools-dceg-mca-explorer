// BarChart.js
import * as d3 from 'd3';
import { group } from 'd3';
import React, { useRef, useEffect } from 'react';



function SingleChart( props ){
    const ref = useRef();


    useEffect(() => {
      const data = props.data;
      //console.log(data, props.chromesomeId)
      let maxLen = 0;
      //sort the line order, first by type, start and end 
      data.sort((a,b) => a.type===b.type? 
      (a.start ===b.start? b.end-a.end: b.start-a.start):a.type-b.type)
      data.forEach((element,index) => {
        element.ypos = index
        if (Number(element.end) > maxLen) {
          maxLen = element.end;
        }
      });
      console.log(maxLen)
      const width = props.width;
      const height = props.height-20;
      const margin = {top:20,right:20,bottom:20,left:20}
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
        
           svg.append("filter")
           .attr("x","0")
           .attr("y","0")
           .attr("id","solid")
           .append("feFlood").attr("flood-color","yellow")

{   const keys = ["start","length","type"]
   // console.log(data,keys)
    y.domain(data.map(d => d.ypos));
    x.domain([0, maxLen]).nice();
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
          .attr("width", d => x(d[1]))
          .attr("fill", d => group(d.data.type)[e.key])
         .on("mouseover", function(event,d) {
 
          svg.append('text')
            .attr('x',event.layerX)
            .attr('y',event.layerY-150)
            .attr("filter","url(#solid)")
            .attr("id","tooltipbackground")
            .text(`sampleId: ${d.data.sampleId} \nstart:${d.data.start}`)

           svg.append('text')
            .attr('id','tooltip')
            .attr('x',event.layerX)
            .attr('y',event.layerY-150)
            .text(`sampleId: ${d.data.sampleId}^start:${d.data.start}`)
            .style('opacity',1)
            .style("fill",'blue')
           

       });
      })
      .on("mouseout", function() { 
        d3.select('#tooltip').remove();
        d3.select('#tooltipbackground').remove();

      })
       .on("mousemove", function(d) {
        // var xPosition = d.mouseEvent.x - 15;
        // var yPosition = d.mouseEvent.y - 25;
        // tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        // tooltip.select("text").text(d.y);
        });
    ;
    

    var xscale = d3.scaleLinear()
            .domain([0,maxLen])
            .range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));

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