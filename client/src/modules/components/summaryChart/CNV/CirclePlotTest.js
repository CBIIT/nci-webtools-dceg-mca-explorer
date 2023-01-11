import * as React from "react";
import Circos, {
  HIGHLIGHT,
  STACK
} from "react-circos";
import layout from "./layout2.json";
import loss from "./loss.json";
import loh from "./loh.json";
import gain from "./gain.json"
import band from "./band.json"

//import "./styles.css";
const hovertip = (d =>{
  return "Value:" + d.value + "<br> Start:" + d.start+"<br> End:"+d.end+"<br> Ancestry:"+d.ancestry+"<br> Sex:"+d.sex;
})

const size = 800;
export default function CircleTest() {
  return (
    <div className="align-middle text-cernter">
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
            data: loss, 
            config: {
              innerRadius: 0.25,
              outerRadius: 0.5,
              thickness:-1,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"red",
              direction: 'out',
              logScale: true,
              color: "red",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
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
            data: loh,
            config: {
              innerRadius: 0.5,
              outerRadius: 0.75,
              thickness:-1,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"blue",
              direction: 'out',
              logScale: true,
              color: "blue",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
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
            data: gain,
            config: {
              innerRadius: 0.75,
              outerRadius: 1,
              thickness:-1,
              margin: 0,
              strokeWidth: 1,
              strokeColor:"green",
              direction: 'out',
              logScale: true,
              color: "green",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
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
