import { useEffect, useRef, useState } from "react";
import Circos, { HIGHLIGHT, STACK } from "react-circos";
import band from "./band.json";
import { Container } from "react-bootstrap";

export default function CircosPlot(props) {
  //return NGCircos01;
  const layoutAll = props.layoutAll;
  const dataXY = [...props.circle.chrx, ...props.circle.chry];
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
  const titleHeight = props.maxtitleHeight
 
 

  return (
    <>
    <Container style={{ display:"flex",flexDirection:"column",alignItems:"center",position:"relative",fontSize: "14px",minHeight:`${titleHeight+size+20}px` }}>

    {/* <div ref={titleRef} style={{ marginBottom:"1rem",fontSize: "14px" }}>{props.title}</div> */}
    {/* <div style={{ fontSize: "14px" }}>{props.msg}</div> */}
    <Container style={{ position:"relative", width:"100%", textAlign:"center"}}>
    <div id="A" style={{ textAlign:"center", position: "absolute", zIndex:"1000", top:`${titleHeight}px`,left:"50%",transform:"translateX(-50%)"}}>
        <Circos
          layout={layoutxy}
          config={{
            innerRadius: size / 2 - 50,
            outerRadius: size / 2 - 30,
            ticks: {
              display: true,
              color: "black",
              labels: false,
            },
            labels: {
              position: "center",
              display: true,
              size: 14,
              color: "#000",
              radialOffset: 28,
            }
          }}
          tracks={[
            {
              type: STACK,
              data: dataXY,
              config: {
                innerRadius: 0.05,
                outerRadius: 1,
                thickness: thicknessloss,
                margin: 0,
                strokeWidth: 1,
                strokeColor: "red",
                direction: "out",
                // logScale: true,
                color: "red",
                backgrounds: [
                  {
                    start: 0,
                    end: 0,
                    color: "white",
                    opacity: 1,
                  },
                ],
                tooltipContent: function (d) {
                  return hovertip(d);
                },
                // events: {
                //   mouseover: function (d, i, nodes, event) {
                //     console.log("mouse over");
                //   },
                //   click: function (d, i, nodes, event) {
                //     console.log("mouse over");
                //   },
                // },
              },
            },
          ]}
          size={size}
        />
      </div>
      {/* <div style={{ justifyContent: "center",fontSize: "14px",color:"white" }}>{props.title===""?"":" . "}</div> */}
      <div
        id={props.details}
        style={{ textAlign:"center", position: "absolute", zIndex:"0",top:`${titleHeight}px`, left:"50%",transform:"translateX(-50%)"}}
        ref={circleRef}
        onMouseEnter={handleEnter}
        onClick={handleEnter}>
          
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
              data: circle.undetermined,
              config: {
                innerRadius: 0.05,
                outerRadius: 0.25,
                thickness: thicknessundermined,
                margin: 0,
                strokeWidth: 1,
                strokeColor: "grey",
                direction: "out",
                logScale: true,
                color: "grey",
                backgrounds: [
                  {
                    start: 0,
                    end: 1,
                    color: "grey",
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
              data: circle.loss,
              config: {
                innerRadius: 0.25,
                outerRadius: 0.5,
                thickness: thicknessloss,
                margin: 0,
                strokeWidth: 1,
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
              data: circle.loh,
              config: {
                innerRadius: 0.5,
                outerRadius: 0.75,
                thickness: thicknessloh,
                margin: 0,
                strokeWidth: 1,
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
              data: circle.gain,
              config: {
                innerRadius: 0.75,
                outerRadius: 1,
                thickness: thicknessgain,
                margin: 0,
                strokeWidth: 1,
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
        {/* <div style={{ whiteSpace: "pre-line", justifyContent: "center" }}>{props.details}</div> */}
      </div>
      </Container>
      {/* <div style={{ fontSize: "14px",justifyContent: "center",paddingTop:"430px" }}>{props.msg}</div>  */}
      <div style={{paddingTop:`${titleHeight+size}px`, fontSize: "14px" }}>{props.msg}</div>
      </Container>
    </>
  );

  //return
}
