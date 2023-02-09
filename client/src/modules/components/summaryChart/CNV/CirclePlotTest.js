import * as React from "react";
import { useEffect, useState } from "react";
import Circos, {
  HIGHLIGHT,
  STACK
} from "react-circos";
import layout from "./layout2.json";
import band from "./band.json"

// import allloss from "./data/allloss.json";
// import allloh from "./data/allloh.json";
// import allgain from "./data/allgain.json"
// import allunknown from "./data/allundermined.json"

// import plcoloss from "./data/plcoloss.json";
// import plcoloh from "./data/plcoloh.json";
// import plcogain from "./data/plcogain.json"
// import plcounknown from "./data/plcoundermined.json"

// import ukloss from "./data/UKloss.json";
// import ukloh from "./data/UKloh.json";
// import ukgain from "./data/UKgain.json"
// import ukunknown from "./data/UKundermined.json"


//import "./styles.css";
const hovertip = (d =>{
  return "<p style='text-align:left'>Sid: " +d.sampleId+ "<br> Study: "+ d.dataset+"<br> Type: "+d.type+ "<br> CF: "+ d.value + "<br> Start: " + d.start+"<br> End: "+d.end+"<br> Ancestry: "+d.ancestry+"<br> Sex: "+d.sex+"</p>";
})
const size = 800;


export default function CirclePlotTest(props) {
  const [circle, setCircle] = useState({
    loss:props.loss,
    gain:props.gain,
    loh:props.loh,
    undetermined:props.undetermined
  }
  );
  useEffect(() => {
    setCircle({
      loss:props.loss,
      gain:props.gain,
      loh:props.loh,
      undetermined:props.undetermined
    })
  },[props])

   console.log(circle.loss)
  return (
    <div className="align-middle text-center">
      <Circos
          layout={layout}
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
            radialOffset: 28
          }
        }}
       tracks={[
         {
            type: STACK,
            data: circle.undetermined, 
            config: {
              innerRadius: 0.15,
              outerRadius: 0.25,
              thickness:-1.5,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"grey",
              direction: 'out',
              logScale: true,
              color: "grey",
              backgrounds: [
                {
                  start: 0,
                  end: 1,
                  color: "grey",
                  opacity: 0.5
                }
              ],
              tooltipContent: function(d) {
                return hovertip(d)
              }
            }
          },
          {
            type: STACK,
            data: circle.loss, 
            config: {
              innerRadius: 0.25,
              outerRadius: 0.5,
              thickness:-1.5,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"red",
              direction: 'out',
              logScale: true,
              color: "red",
              backgrounds: [
                {
                  start: 0,
                  end: 1,
                  color: "#f8787b",
                  opacity: 0.5
                }
              ],
              tooltipContent: function(d) {
                return hovertip(d)
              }
            }
          },
           {
            type: STACK,
            data: circle.loh,
            config: {
              innerRadius: 0.5,
              outerRadius: 0.75,
              thickness:-1.5,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"blue",
              direction: 'out',
              logScale: true,
              color: "blue",
              backgrounds: [
                {
                  start: 0,
                  end: 1,
                  color: "#0095ff",
                  opacity: 0.5
                }
              ],
              tooltipContent: function(d) {
                return hovertip(d);
              }
            }
          },
           {
            type: STACK,
            data: circle.gain,
            config: {
              innerRadius: 0.75,
              outerRadius: 1,
              thickness:-1.5,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"green",
              direction: 'out',
              logScale: true,
              color: "green",
              backgrounds: [
                {
                  start: 0,
                  end: 1,
                  color: "#2fc405",
                  opacity: 0.5,
                }
              ],
              tooltipContent: function(d) {
                return hovertip(d);
              },
              events: {
              //  mouseover:
              //     function(d, i, nodes, event) {
              //       //console.log(d, i, nodes, event);
              //   }
              }
            }
          },
          {
            type: HIGHLIGHT,
            data: band,
            config: {
              innerRadius: size / 2 - 50,
              outerRadius: size / 2 - 35,
              opacity: 0.5,
              color: d => d.color,

              events: {
                click: function(d, i, nodes, event) {
                  console.log("clicking ",d);
                },
                // mouseover:
                // function(d, i, nodes, event) {
                //   console.log(d, i, nodes, event);
                // },
              },
            },
          }
        ]}
        size={size}
      />
       
    </div>
  );
}
