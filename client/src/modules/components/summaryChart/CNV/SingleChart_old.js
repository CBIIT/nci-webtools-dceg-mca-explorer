// BarChart.js
import * as d3 from "d3";
import { group, zoom } from "d3-zoom";
import React, { useRef, useEffect, useState } from "react";
import * as htmlToImage from "html-to-image";
import { svg } from "d3";
import GenePlot from "./GenePlot";

function SingleChart(props) {
  const ref = useRef();
  const [brushExtent, setBrushExtent] = useState(null);
  const [xLeft, setXLeft] = useState(0);
  const [xRight, setXRight] = useState(0);
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

  const width = props.width;
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const height = props.height - margin.bottom;
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height; // - margin.top - margin.bottom;

  const data0 = [...props.data];
  //console.log(data0, props.chromesomeId);
  let maxLen = 0;
  //sort the line order, first by type, start and end
  // const lessPrecision = (val, precision = 10) => Math.floor(val / precision);
  // const sort = (a, b) =>
  //   lessPrecision(a.start, 10) - lessPrecision(b.start, 10) || lessPrecision(b.end, 50) - lessPrecision(a.end, 50);

  data0.forEach((element, index) => {
    element.ypos = index;
    //element.start=Number(element.start)
    //element.length=Number(element.length)
    if (Number(element.end) > maxLen) {
      maxLen = element.end;
    }
  });
  data0.sort((a, b) =>
    a.type === b.type
      ? a.start === b.start
        ? a.length === b.length
          ? a.end - b.end
          : a.length - b.length
        : b.start - a.start
      : a.type - b.type
  );

  // data0.sort((a,b) => a.type===b.type?
  // (a.start ===b.start? b.end-a.end: b.start-a.start):
  // a.type-b.type)

  const data = [
    { start: "0", length: "0", type: "Gain" },
    { start: "0", length: "0", type: "CN-LOH" },
    { start: "0", length: "0", type: "Loss" },
    { start: "0", length: "0", type: "Undetermined" },
    ...data0,
  ];
  useEffect(() => {
    //console.log(maxLen, props.chromesomeId);

    const svg = d3.select(ref.current);

    svg.attr("viewBox", `0 0 ${width + margin.right + margin.left} ${height + margin.bottom}`);

    const y = d3.scaleBand().range([margin.bottom, chartHeight]).padding(0.1);
    const x = d3.scaleLinear().range([0, width]);
    const z = d3.scaleOrdinal().range([0.25, 0.5, 0.75, 1]);
    const group = d3
      .scaleOrdinal()
      .range([
        { start: "white", length: "green" },
        { start: "white", length: "blue" },
        { start: "white", length: "red" },
        { start: "white", length: "grey" },
      ])
      .unknown("white");

    const tooltip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);

    const keys = ["start", "length"];

    // const stackedData = d3.stack().keys(keys)(data);console.log(stackedData,keys)

    y.domain(data.map((d) => d.ypos));
    x.domain([0, maxLen]); //.nice();
    // z.domain(keys);
    group.domain(data.map((d) => d.type));

    svg.selectAll("*").remove();
    const bar = svg
      .append("g")
      .attr("class", "bar")
      //.attr("clip-path", "url(#clip)")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .each(function (e) {
        d3.select(this)
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("y", (d) => y(d.data.ypos))
          .attr("x", (d) => x(d[0]))
          .attr("height", y.bandwidth())
          .attr("width", (d) => x(d[1] - d[0]))
          //.attr("fill", d=>color(d.data.type))
          .attr("fill", (d) => group(d.data.type)[e.key])
          .on("mouseover", function (event, d) {
            // console.log(d)
            if (!this.outerHTML.includes("white")) {
              tooltip.transition().duration(200).style("opacity", 0.9);
              tooltip
                .html(
                  // "Study: " +
                  //   d.data.dataset +
                    "<br/>Sample Id: " +
                    d.data.sampleId +
                    "<br/>Start: " +
                    d.data.start +
                    "<br/>End: " +
                    d.data.end +
                    "<br/>Type: " +
                    d.data.type +
                    "<br/>Cellular Fraction:" +
                    d.data.value +
                    "<br/>Ancestry: " +
                    d.data.ancestry +
                    "<br/>Sex: " +
                    d.data.sex +
                    "<br/>Age: " +
                    d.data.age
                )
                .style("left", event.pageX + "px")
                .style("top", event.pageY - 20 + "px");
            }
          });
      })
      .on("mouseout", function () {
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("mousemove", function (d) {});

    var xscale = d3.scaleLinear().domain([0, maxLen]).range([2, width]);
    const xAxis = d3.axisBottom(xscale);
    const xAxisG = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    const onBrushEnd = (event) => {
      const selection = event.selection;
      const xleft = selection ? xscale.invert(selection[0]) : null;
      const xright = selection ? xscale.invert(selection[1]) : null;
      setBrushExtent([xleft, xright]);
      xscale.domain([xleft, xright]);
      // Update x-scale domain and axis
      //console.log(svg.select('.x-axis'),"xscale",xscale)

      svg.select(".x-axis").transition().duration(500).call(d3.axisBottom(xscale));

      // Update bar widths and positions
      // svg.selectAll('.bar')
      //   .transition()
      //   .duration(500)
      //   .attr("width", (d) => xright-xleft)
      //   .attr('x', margin.left);
    };
    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on("end", onBrushEnd);

    const brushG = svg.append("g").attr("class", "brush").call(brush);

    svg.call(brush);
  }, [props, brushExtent]);

  console.log(brushExtent);
  // Filter data based on brush extent
  const filteredData = brushExtent ? data.filter((d) => d.start >= brushExtent[0] && d.end <= brushExtent[1]) : data;

  console.log(filteredData);
  return (
    <div>
      <div className="mx-5">
        <a href="javascript:void(0)" onClick={handleDownload} style={{ float: "right", justifyContent: "flex-end" }}>
          Download
        </a>
      </div>
      <div>
        <svg ref={ref} width={props.width} height={props.height}></svg>
      </div>
    </div>
  );
}

export default SingleChart;
