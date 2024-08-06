//import { useEffect, useRef, useState } from "react";
import Circos, { HIGHLIGHT, STACK } from "react-circos";
import band from "./band.json";
import { useEffect, useState } from "react";
import { initialData, initialChrX, initialChrY } from "../../../mosaicTiler/constants";

export default function CircosPlot(props) {
  //return NGCircos01;
  const layoutAll = props.layoutAll;
  const dataXY = props.dataXY;
  const isX = dataXY.some((obj) => obj.hasOwnProperty("block_id") && obj.block_id === "X");
  const isY = dataXY.some((obj) => obj.hasOwnProperty("block_id") && obj.block_id === "Y");
  const size = props.size;
  const thicknessloss = props.thicknessloss;
  const thicknessgain = props.thicknessgain;
  const thicknessundermined = props.thicknessundermined;
  const thicknessloh = props.thicknessloh;
  const circle = props.circle;
  const circleRef = props.circleRef;
  const handleEnter = props.handleEnter;
  const hovertip = props.hovertip;
  const classCircle = props.circleClass;
  const layoutxy = props.layoutxy;
  //const checkMaxLines = props.checkMaxLines;
  const [plotLoaded, setPlotLoaded] = useState(false);

  const [plotgain, setPlotgain] = useState(
    circle.gain
      .concat(initialData)
      .concat(isX ? initialChrX : [])
      .concat(isY ? initialChrY : [])
  );
  const [plotloh, setPlotloh] = useState(
    circle.loh
      .concat(initialData)
      .concat(isX ? initialChrX : [])
      .concat(isY ? initialChrY : [])
  );
  const [plotloss, setPlotloss] = useState(
    circle.loss
      .concat(initialData)
      .concat(isX ? initialChrX : [])
      .concat(isY ? initialChrY : [])
  );
  const [plotunder, setPlotunder] = useState(
    circle.undetermined
      .concat(initialData)
      .concat(isX ? initialChrX : [])
      .concat(isY ? initialChrY : [])
  );

  return (
    <div style={{ justifyContent: "center" }} id="summaryCircle">
      <div className={classCircle} ref={circleRef} onMouseEnter={handleEnter} onClick={handleEnter}>
        {/* <div style={{ justifyContent: "flex-start", fontSize: "14px" }}>{props.title.slice(1)}</div> */}
        <div ref={props.circleRefTable}>
          <Circos
            layout={layoutAll}
            config={{
              innerRadius: size / 2 - 50,
              outerRadius: size / 2 - 30,
              ticks: {
                display: true,
                color: "black",
                //spacing: 100000,
                labels: false,
                // labelSpacing: 10,
                // labelSuffix: "",
                // labelDenominator: 1,
                // labelDisplay: true,
                // labelSize: "5px",
                // labelColor: "yellow",
                // labelFont: "default",
                // majorSpacing: 1
              },
              labels: {
                position: "center",
                display: true,
                size: 14,
                color: "#000",
                radialOffset: 28,
              },
            }}
            tracks={[
              {
                type: STACK,
                data: plotunder,
                config: {
                  innerRadius: 0.05,
                  outerRadius: 0.25,
                  thickness: circle.undetermined.length < 2000 ? (circle.undetermined.length < 500 ? 2 : 1) : -1,
                  margin: 0,
                  strokeWidth: circle.undetermined.length < 1500 ? 0.5 : 0.2,
                  strokeColor: "grey",
                  direction: "out",
                  // logScale: true,
                  color: "#585858",
                  backgrounds: [
                    {
                      start: 0,
                      end: 1,
                      color: "#808080",
                      opacity: 0.5,
                    },
                  ],
                  tooltipContent: function (d) {
                    return hovertip(d);
                  },
                  events: {
                    //  'mouseover.alert':
                    //     function(d, i, nodes, event) {
                    //       console.log(d,i, nodes)
                    //       //changeBackground(track, chromesomeId, color)
                    //   }
                    //   ,
                    //   click:function(d, i, nodes, event) {
                    //     console.log(d)
                    //       return hovercoler(d);
                    //   }
                  },
                },
              },
              {
                type: STACK,
                data: plotloss.concat(dataXY),
                config: {
                  innerRadius: 0.25,
                  outerRadius: 0.5,
                  thickness: circle.loss.length < 1500 ? (circle.loss.length < 500 ? 2 : 1) : -1,
                  margin: 0,
                  strokeWidth: circle.loss.length < 1500 ? 0.5 : 0.2,
                  strokeColor: "red",
                  direction: "out",
                  // logScale: true,
                  color: "red",
                  backgrounds: [
                    {
                      start: 0,
                      end: 1,
                      color: "#f8787b",
                      opacity: 0.5,
                    },
                  ],
                  tooltipContent: function (d) {
                    return hovertip(d);
                  },
                  events: {
                    // 'mouseover.alert':
                    //   function(d, i, nodes, event) {
                    //     //return hovercoler(d);
                    // },
                    // click:function(d, i, nodes, event) {
                    //     return hovercoler(d);
                    // }
                  },
                },
              },
              {
                type: STACK,
                data: plotloh,
                config: {
                  innerRadius: 0.5,
                  outerRadius: 0.75,
                  thickness: circle.loh.length < 1500 ? (circle.loh.length < 500 ? 2 : 1) : -1,
                  margin: 0,
                  strokeWidth: circle.loh.length < 1500 ? 0.5 : 0.2,
                  strokeColor: "blue",
                  direction: "out",
                  //logScale: true,
                  color: "blue",
                  backgrounds: [
                    {
                      start: 0,
                      end: 1,
                      color: "#0095ff",
                      opacity: 0.5,
                    },
                  ],
                  tooltipContent: function (d) {
                    return hovertip(d);
                  },
                },
              },
              {
                type: STACK,
                data: plotgain,
                config: {
                  innerRadius: 0.75,
                  outerRadius: 1,
                  thickness: circle.gain.length < 1500 ? (circle.gain.length < 500 ? 2 : 1) : -1,
                  margin: 0,
                  strokeWidth: circle.gain.length < 1500 ? 0.5 : 0.2,
                  strokeColor: "green",
                  direction: "out",
                  // logScale: true,
                  color: "green",
                  backgrounds: [
                    {
                      start: 0,
                      end: 1,
                      color: "#2fc405",
                      opacity: 0.5,
                    },
                  ],
                  tooltipContent: function (d) {
                    return hovertip(d);
                  },
                },
              },
              {
                type: HIGHLIGHT,
                data: band,
                config: {
                  innerRadius: size / 2 - 50,
                  outerRadius: size / 2 - 35,
                  opacity: 0.5,
                  color: (d) => d.color,

                  events: {
                    click: function (d, i, nodes, event) {
                      console.log("clicking ", d);
                    },
                    mouseover: function (d, i, nodes, event) {
                      //console.log(d.block_id);
                      //change class="cs-layout" class=d.block_id, fill="grey" to highlight the chromosome
                      //document.getElementsByClassName()
                    },
                  },
                },
              },
            ]}
            size={size}
          />
          <div style={{ whiteSpace: "pre-line", justifyContent: "center" }}>{props.details}</div>
          <div style={{ whiteSpace: "pre-line", justifyContent: "center" }}>{props.msg}</div>
        </div>
      </div>
    </div>
  );
  //return
}

////
// const test = [
//   {
//     PopID: "East Asian",
//     block_id: "7",

//     chromosome: "chr7",
//     computedGender: "F",
//     dataset: "UKBB",
//     end: "23063415",
//     endAngle: 0.043344639683771745,
//     endGrch38: "23063415",
//     id: 16953,
//     innerRadius: 17.212,
//     layer: 0,
//     length: "23063415",
//     outerRadius: 19.212,
//     start: "0",
//     startAngle: 0,

//     value: "0.0365",
//   },
//   {
//     PopID: "East Asian",
//     block_id: "8",

//     chromosome: "chr8",
//     computedGender: "F",
//     dataset: "UKBB",
//     end: "23063415",
//     endAngle: 0.043344639683771745,
//     endGrch38: "23063415",
//     id: 16953,
//     innerRadius: 17.212,
//     layer: 0,
//     length: "23063415",
//     outerRadius: 19.212,
//     start: "0",
//     startAngle: 0,

//     value: "0.0365",
//   },
// ];
//console.log(plotunder, initialData);
