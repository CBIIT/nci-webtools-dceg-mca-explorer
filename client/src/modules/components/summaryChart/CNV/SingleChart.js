// BarChart.js
import * as d3 from 'd3';
import { group, zoom } from 'd3-zoom';
import React, { useRef, useEffect, useState} from 'react';
import * as htmlToImage from 'html-to-image';
import { svg } from 'd3';



function SingleChart( props ){
    const ref = useRef();

    const handleDownload = ()=>{
      //console.log(ref.current)
      htmlToImage.toPng(ref.current, { quality: 0.95, backgroundColor:"white"})
      .then((dataUrl)=>{
        var link = document.createElement('a');
        link.download = 'chromosome.png';
        link.href = dataUrl;
        link.click();
      }) 
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
     });  
    }

    useEffect(() => {
      const data0 =[...props.data]
      console.log(data0, props.chromesomeId)
      let maxLen = 0;
      //sort the line order, first by type, start and end 
      const lessPrecision = (val, precision = 10) => Math.floor(val / precision);
      const sort = (a, b) => (lessPrecision(a.start, 10) - lessPrecision(b.start, 10))
      || (lessPrecision(b.end, 50) - lessPrecision(a.end, 50));

      data0.forEach((element,index) => {
        element.ypos = index
        element.start=Number(element.start)
        element.length=Number(element.length)
        if (Number(element.end) > maxLen) {
          maxLen = element.end;
        }
      });
      data0.sort((a,b) => a.type===b.type? 
      (a.start===b.start?
        (a.length ===b.length? a.end-b.end: a.length-b.length):
        b.start-a.start):
          a.type-b.type)

      // data0.sort((a,b) => a.type===b.type? 
      // (a.start ===b.start? b.end-a.end: b.start-a.start):
      // a.type-b.type)
      
 
      const data = [  
        {start:'0',length:'0',type:"Gain"},
        {start:'0',length:'0',type:"CN-LOH"},
        {start:'0',length:'0',type:"Loss"},
        {start:'0',length:'0',type:"Undetermined"},
        ...data0]
      console.log(maxLen, props.chromesomeId)
      const width = props.width;
      const margin = {top:20,right:20,bottom:20,left:20}
      const height = props.height- margin.bottom;
      const chartWidth = width - margin.left -margin.right;
      const chartHeight = height;// - margin.top - margin.bottom;

      const svg = d3.select(ref.current);
      svg.selectAll("*").remove();
      
    
        
      const y = d3.scaleBand()
        .range([ margin.bottom, chartHeight])
        .padding(0.1);
      const x = d3.scaleLinear()
        .range([0, width]);
      const z = d3.scaleOrdinal()
        .range([0.25, 0.5, 0.75, 1]);
      const group = d3.scaleOrdinal()
        .range([
                 { start: "white", length: "green"},
                 { start: "white", length: "blue" },
                  {start: "white", length: "red" },
                  { start: "white", length: "grey" }
             ]   
            )
        .unknown("white"); 

        // Add a clipPath: everything out of this area won't be drawn.
        var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

        const tooltip = d3.select("body").append("div")
        .attr("class","tooltip")
        .style("opacity",0)

   const keys = ["start","length"]


  const stackedData = d3.stack()
        .keys(keys)(data);
    console.log(stackedData,keys)


    y.domain(data.map(d => d.ypos));
    x.domain([0, maxLen])//.nice();
   // z.domain(keys);
    group.domain(data.map(d => d.type));
   
    svg.append("g")
      //.attr("clip-path", "url(#clip)")
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
          //.attr("fill", d=>color(d.data.type))
          .attr("fill", d => group(d.data.type)[e.key])
          .on("mouseover", function(event,d) {
           // console.log(d)
          //if (!this.outerHTML.includes("white")){
            tooltip.transition().duration(200).style("opacity",0.9)
            tooltip.html("Study: "+d.data.dataset+"<br/>SampleId: "+ d.data.sampleId+"<br/>Start: "+d.data.start
             +"<br/>End: "+d.data.end+"<br/>Type: "+d.data.type+"<br/>Cellular Fraction:"+d.data.value
             +"<br/>Ancestry: "+d.data.ancestry+"<br/>Sex: "+d.data.sex
             +"<br/>Age: "+d.data.age)
            .style("left",(event.pageX)+"px")
            .style("top",(event.pageY-20)+"px")
         //}
       });
      })
      .on("mouseout", function() { 
        tooltip.transition().duration(500).style("opacity",0)
      })
       .on("mousemove", function(d) {
        })
    ;
   


     const handleZoom = zoom().scaleExtent([0.5,10]).on('zoom',handleZoomed);

    function handleZoomed (event) {
      const transform = event.transform;
      svg.select('.x-axis').call(d3.axisBottom(x.copy().range([0,width].map(d=>transform.applyX(d)))));
      svg.select('.y-axis').call(d3.axisLeft(y.copy().range([height,0].map(d=>transform.applyY(d)))));
      console.log("zoomin")
       svg.selectAll("rect")
          .data(d3.stack().keys(keys)(data))
           .enter()
           .attr("y", d => y(d.data.ypos))
           .attr("x", d => x(d[0]))
          .attr("height", y.bandwidth())
          .attr("width", d => x(d[1]))

    }
   // svg.call(handleZoom);
  // var yAxis = svg.append("g").call(d3.axisLeft(y));
  // var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
      
   var xscale = d3.scaleLinear().domain([0,maxLen]).range([10, width]);

   svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));

    // svg.selectAll("rect")
    //    .call(d3.zoom().on("zoom", (event) => {
    //    svg.attr("transform", event.transform)
    // }));
    // var yAxis = svg.append("g").call(d3.axisLeft(y));
   // var xAxis = svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    ////
        // Add brushing
    // var brushx = d3.brushX()                 // Add the brush feature using the d3.brush function
    //   .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //   .on("brush", (e)=>{
    //     const selection = (e.selection)
    //     if(selection != null){
    //       const[x0,x1]=selection;
    //       svg.selectAll("g").attr("x", d => x(d[0]))
    //       svg.select('.brush-y').call(brushy.clear)
    //       //console.log("x",x0,x1)
    //     }
    //   })        
    // var brushy = d3.brushY()                 // Add the brush feature using the d3.brush function
    //   .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    //   .on("end", (e)=>{
    //     const selection = (e.selection)
    //     if(selection != null){
    //       const[y0,y1]=selection;
    //       y.domain([y0,y1])
    //         //svg.select(".brush-y").call(brushy.move, null) // This remove the grey brush area as soon as the selection has been done
    //       //  svg.selectAll("*").remove();
    //       //console.log(svg.selectAll('rect'))
    //         const yzoom = d3.scaleBand()
    //         .range([y0,y1]).padding(0.1);
    //         yAxis.transition().duration(1000).call(d3.axisLeft(yzoom))
    //         // svg.selectAll("rect")
    //         //      .transition().duration(1000)
    //         //       .data(d => d)
    //         //       .enter()
    //         //       .append("rect")
    //         //       .attr("y", (d) => {
    //         //         console.log(d)
    //         //         y(d.data.ypos)
    //         //       })     
    //     }
    //   }) 
    // svg.append("g").attr("class", "brush-x").call(brushx);
    // svg.append("g").attr("class", "brush-y").call(brushy);
    
    //   // brush
    const brush = d3.brush()
      // .extent([
      //   [0, 0],
      //   [width, height],
      // ])
      .on("start brush end", (event) => {
        if (event.selection) {
          const indexSelection = event.selection.map(xscale.invert);
          const x0 = event.selection[0][0];
          const y0 = event.selection[0][1];
          const x1 = event.selection[1][0];
          const y1 = event.selection[1][1];
       
          const yzoom = d3.scaleBand().range([y0,y1]).padding(0.1);
          //xAxis.transition().duration(1000).call(d3.axisBottom(x))
          //yAxis.transition().duration(1000).call(d3.axisLeft(yzoom))
        }
      });
      // svg.append("g").attr("class", "brush").call(brush);
     
       var zoomchart = function(event){
          console.log(event)
          //var newX = event.transform.rescaleX(x);
          //var newY = event.transform.rescaleY(y);

          // update axes with these new boundaries
         // xAxis.call(d3.axisBottom(newX))
          //yAxis.call(d3.axisLeft(newY))
          console.log("zoom")
          //x.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
          //svg.selectAll(".bars rect").attr("x", d => x(d.name)).attr("width", x.bandwidth());
         // svg.selectAll(".x-axis").call(xAxis);
        };

      //svg.call(handleZoom)
        svg.append("text")
        .attr("x", width/2-50)
        .attr("y", 11)
        .attr("text-anchor", "start")
        .text("Chromosome: "+ props.chromesomeId);
  
     },[props]);

   

    return (
      <div>
        <div className="mx-5">
          <a href="javascript:void(0)" onClick={handleDownload} style={{ float: 'right' ,justifyContent: "flex-end" }}>Download</a>
        </div>
          <div >
           <svg ref={ref} width={props.width} height={props.height}></svg>
        </div>
      </div>
    )

}

export default SingleChart;