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
          { Start: "none", Min: "lightgreen", All: "green", Max: "darkgreen" },
          { Start: "none", Min: "indianred", All: "red", Max: "darkred" },
          { Start: "none", Min: "lightsteelblue", All: "steelblue", Max: "darksteelblue" }
        ]);

// d3.csv("https://gist.githubusercontent.com/JimMaltby/844ca313589e488b249b86ead0d621a9/raw/f328ad6291ffd3c9767a2dbdba5ce8ade59a5dfa/TimeBarDummyFormat.csv", d3.autoType, (d, i, columns) => {
//       var i = 3;
//       var t = 0;
//       for (; i < columns.length; ++i)
//         t += d[columns[i]] = +d[columns[i]];
//       d.total = t;
//       return d;
//     }

//   ).then(function(data)
   {
    //const keys = data.columns.slice(3); // takes the column names, ignoring the first 3 items = ["EarlyMin","EarlyAll", "LateAll", "LateMax"]
    const keys = ["value","end","type"];
    console.log(data,keys)
    y.domain(data.map(d => d.name));
    x.domain([2000, d3.max(data, d => d.value+d.end)]).nice();
    z.domain(keys);
    group.domain(data.map(d => d.type));

    svg.append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter().append("g")
      .each(function(e) {
        console.log(e)
        d3.select(this)
          .selectAll("rect")
          .data(d => d)
          .enter()
          .append("rect")
          .attr("y", d => y(d.data.name))
          .attr("x", d => x(d[0]))
          .attr("height", y.bandwidth())
          .attr("width", d => x(d[1]) - x(d[0]))
          .attr("fill", d => group(d.data.type)[e.key]);
      });
      

    svg.append("g")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x));

    svg.append("g")
      .call(d3.axisLeft(y));
  }


            // .attr("width", width)
            // .attr("height", height)
            // .style("border", "1px solid black")
   
    // const colorScaleGain = d3.scaleOrdinal().domain(['value','end']).range(["white","green"]);
    // const colorScaleLoss = d3.scaleOrdinal().domain(['value','end']).range(["white","red"]);
    // const colorScaleNeutral = d3.scaleOrdinal().domain(['value','end']).range(["white","blue"]);
    // const colorScaleUndermined = d3.scaleOrdinal().domain(['value','end']).range(["white","grey"]);
    // //console.log(colorScale)
    // const colors = d3.scaleOrdinal(d3.schemeCategory10);

    // const y = d3.scaleBand().domain(data.map(d => d.name))
    // .range([0,chartHeight]).padding(0);

    // const x = d3.scaleLinear()
    // .domain([0,d3.max(data, d=>d.value+d.end)])
    // .range([0,chartWidth]);

    // const z = d3.scaleOrdinal().range([0.25, 0.5, 0.75, 1]);
    // const group = d3.scaleOrdinal()
    //     .range([
    //       { Start: "none", Min: "lightgreen", All: "green", Max: "darkgreen" },
    //       { Start: "none", Min: "indianred", All: "red", Max: "darkred" },
    //       { Start: "none", Min: "lightsteelblue", All: "steelblue", Max: "darksteelblue" }
    //     ]);
    // group.domain(data.map(d => d.type));


    //  const xAxis = d3.axisBottom(x);
    //  const yAxis = d3.axisLeft(y);

    //  const stackLayout = d3.stack().keys(['value','end'])
    //  //.order(d3.stackOrderNone).offset(d3.stackOffsetNone);
    //  const stackData = stackLayout(data);
    //  //console.log(y.bandwidth())
    //  svg
    // .selectAll("g")
    //  .data(stackData)
    //  .join("g")
    //   .each(function(e) {
    //    d3.select(this)
    //   .selectAll("rect")
    //   .data(d=>d)
    //   .enter()
    //   .append("rect")
    //   .attr('x', d=> x(d[0]))
    //   .attr('y',d => y(d.data.name))
    //   .attr('height',y.bandwidth()/2)
    //   .attr('width',d => x(d[1])- x(d[0]))
    //   .attr("fill", d => group(d.data.Group)[e.key]);
     

    // })
    // //  .each(function(e) {
    // //   d3.select(this)
    // //   .attr("fill", d => {console.log(e);return group(e.data.type)[e.key]} )
    // //   .selectAll("rect")
    // //   .data(d=>d)
    // //   .join("rect")
    // //   .attr('x', d=> x(d[0]))
    // //   .attr('y',d => y(d.data.name))
    // //   .attr('height',y.bandwidth()/2)
    // //   .attr('width',d => x(d[1])- x(d[0]))});
 
    //   svg.append("g")
    //  .attr("transform",`translate(0,${chartHeight})`)
    //  .call(xAxis)

    //  svg.append("g").call(yAxis)
     },[]);
 //   svg
  //   .append("g")
  //   .attr("transform",`translate(${margin.left},${margin.top})`)
  //   .selectAll("g")
  //   .data(d3.stack().keys(["value"])(data))
  //   .join("g")
  //   .attr("fill",d=>colorScale(d.color))
  //   .selectAll("rect")
  //   .data(d=>d)
  //   .join("rect")
  //   .attr('x', d=> x(d[0]))
  //   .attr('y',d => y(d.data.name))
  //   .attr('width',d=>x(d[1])-x(d[0]))
  //   .attr('height',y.bandwidth());
  //        },[props.data]);



    return (
      <div >
       <svg ref={ref} width={props.width} height={props.height}></svg>
      </div>
    )

}

export default SingleChart;