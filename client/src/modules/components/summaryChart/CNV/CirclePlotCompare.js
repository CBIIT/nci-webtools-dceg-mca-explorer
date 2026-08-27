import Circos, { HIGHLIGHT, STACK } from "react-circos";
import band from "./band.json";
import { Container } from "react-bootstrap";
import { initialData, initialChrX, initialChrY } from "../../../mosaicTiler/constants";
import { THINNEST_THICKNESS, getStrokeWidth } from "./thickness";

const ringBackgrounds = [
  { innerRadius: 0.05, outerRadius: 0.25, color: "#808080" },
  { innerRadius: 0.25, outerRadius: 0.5, color: "#f8787b" },
  { innerRadius: 0.5, outerRadius: 0.75, color: "#0095ff" },
  { innerRadius: 0.75, outerRadius: 1, color: "#2fc405" },
];

export default function CircosPlot(props) {
  //return NGCircos01;
  const layoutAll = props.layoutAll;
  const dataXY = [...props.circle.chrx, ...props.circle.chry];
  const isX = dataXY.some((obj) => obj.hasOwnProperty("block_id") && obj.block_id === "X");
  const isY = dataXY.some((obj) => obj.hasOwnProperty("block_id") && obj.block_id === "Y");

  const size = props.size;
  const circle = props.circle;
  const thicknessUndetermined = props.thickness ?? THINNEST_THICKNESS;
  const thicknessLoss = props.thickness ?? THINNEST_THICKNESS;
  const thicknessLoh = props.thickness ?? THINNEST_THICKNESS;
  const thicknessGain = props.thickness ?? THINNEST_THICKNESS;
  const strokeWidthUndetermined = getStrokeWidth(thicknessUndetermined);
  const strokeWidthLoss = getStrokeWidth(thicknessLoss);
  const strokeWidthLoh = getStrokeWidth(thicknessLoh);
  const strokeWidthGain = getStrokeWidth(thicknessGain);
  const circleRef = props.circleRef;
  const handleEnter = props.handleEnter;
  const hovertip = props.hovertip;
  const titleHeight = props.maxtitleHeight;
  const innerRadius = size / 2 - 50;
  const outerRadius = size / 2 - 30;

  const plotgain = circle.gain.concat(initialData).concat(isX ? initialChrX : []).concat(isY ? initialChrY : []);
  const plotloh = circle.loh.concat(initialData).concat(isX ? initialChrX : []).concat(isY ? initialChrY : []);
  const plotloss = circle.loss.concat(initialData).concat(isX ? initialChrX : []).concat(isY ? initialChrY : []);
  const plotunder = circle.undetermined.concat(initialData).concat(isX ? initialChrX : []).concat(isY ? initialChrY : []);

  return (
    <>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          fontSize: "14px",
          minHeight: `${titleHeight + size + 20}px`,
        }}>
        {/* <div ref={titleRef} style={{ marginBottom:"1rem",fontSize: "14px" }}>{props.title}</div> */}
        {/* <div style={{ fontSize: "14px" }}>{props.msg}</div> */}
        <Container style={{ position: "relative", width: "100%", textAlign: "center" }}>
          <div
            id="circleCompare"
            style={{
              textAlign: "center",
              position: "absolute",
              zIndex: "10",
              top: `${titleHeight}px`,
              left: "50%",
              transform: "translateX(-50%)",
            }}></div>
          {/* <div style={{ justifyContent: "center",fontSize: "14px",color:"white" }}>{props.title===""?"":" . "}</div> */}
          <div
            id={props.details}
            style={{
              textAlign: "center",
              position: "absolute",
              zIndex: "100",
              top: `${titleHeight}px`,
              left: "50%",
              transform: "translateX(-50%)",
            }}
            ref={circleRef}
            onMouseEnter={handleEnter}
            onClick={handleEnter}>
            <Circos
              layout={layoutAll}
              config={{
                innerRadius: innerRadius,
                outerRadius: outerRadius,
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
                ...ringBackgrounds.map((background) => ({
                  type: HIGHLIGHT,
                  data: band,
                  config: {
                    innerRadius: background.innerRadius,
                    outerRadius: background.outerRadius,
                    opacity: 0.5,
                    color: background.color,
                  },
                })),
                {
                  type: STACK,
                  data: plotunder,
                  config: {
                    innerRadius: 0.05,
                    outerRadius: 0.25,
                    thickness: thicknessUndetermined,
                    margin: 0,
                    radialMargin: 0,
                    strokeWidth: strokeWidthUndetermined,
                    strokeColor: "#585858",
                    direction: "out",
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
                    thickness: thicknessLoss,
                    margin: 0,
                    radialMargin: 0,
                    strokeWidth: strokeWidthLoss,
                    strokeColor: "red",
                    direction: "out",
                    //logScale: true,
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
                    thickness: thicknessLoh,
                    margin: 0,
                    radialMargin: 0,
                    strokeWidth: strokeWidthLoh,
                    strokeColor: "blue",
                    direction: "out",
                    // logScale: true,
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
                    thickness: thicknessGain,
                    margin: 0,
                    radialMargin: 0,
                    strokeWidth: strokeWidthGain,
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
                    innerRadius: innerRadius,
                    outerRadius: outerRadius,
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
            {/* <div style={{ whiteSpace: "pre-line", justifyContent: "center" }}>{props.details}</div> */}
          </div>
        </Container>
        {/* <div style={{ fontSize: "14px",justifyContent: "center",paddingTop:"430px" }}>{props.msg}</div>  */}
        <div style={{ paddingTop: `${titleHeight + size}px`, fontSize: "14px" }}>{props.msg}</div>
      </Container>
    </>
  );

  //return
}
