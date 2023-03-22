// BarChart.js
import * as d3 from 'd3';
import { group } from 'd3';
import React, { useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import { RecoilState } from 'recoil';
import { brushX } from 'd3';
import { brushY } from 'd3';



function SingleChart( props ){
    const ref = useRef();
    const handleDownload = ()=>{
      console.log(ref.current)
    
      htmlToImage.toPng(ref.current, { quality: 0.95, backgroundColor:"white"})
      .then((dataUrl)=>{
        var link = document.createElement('a');
        link.download = 'my-image-name.png';
        link.href = dataUrl;
        link.click();
      }) 
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
  });  
    }

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

{   const keys = ["start","length","type"]
   // console.log(data,keys)
    y.domain(data.map(d => d.ypos));
    x.domain([0, maxLen]).nice();
    z.domain(keys);
    group.domain(data.map(d => d.type));

    svg.append("g")
      .selectAll("g")
      .attr("clip-path", "url(#clip)")
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
          if (!this.outerHTML.includes("white")){
            tooltip.transition().duration(200).style("opacity",0.9)
            tooltip.html("Study: "+d.data.dataset+"<br/>SampleId: "+ d.data.sampleId+"<br/>Start: "+d.data.start
             +"<br/>End: "+d.data.end+"<br/>Type: "+d.data.type+"<br/>Cellular Fraction:"+d.data.value
             +"<br/>Ancestry: "+d.data.ancestry+"<br/>Sex: "+d.data.sex
             +"<br/>Age: "+d.data.age)
            .style("left",(event.pageX)+"px")
            .style("top",(event.pageY-20)+"px")
          }
       });
      })
      .on("mouseout", function() { 
        tooltip.transition().duration(500).style("opacity",0)
      })
       .on("mousemove", function(d) {
        });
    ;
    
    var xscale = d3.scaleLinear().domain([0,maxLen]).range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));

    var yAxis = svg.append("g").call(d3.axisLeft(y));
     
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
  }
     },[props]);

    return (
      <div>
        <div className="mx-3">
          <a href="javascript:void(0)" onClick={handleDownload} style={{ float: 'right' ,justifyContent: "flex-end" }}>Download</a>
        </div>
          <div >
              <div>Chromosome {props.chromesomeId}</div>
           <svg ref={ref} width={props.width} height={props.height}></svg>
        </div>
      </div>
    )

}

export default SingleChart;