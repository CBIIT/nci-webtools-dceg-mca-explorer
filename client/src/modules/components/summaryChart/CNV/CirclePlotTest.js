import * as React from "react";
import Circos, {
  STACK
} from "react-circos";
import layout from "./layout.json";
import chords from "./chords.json";
import line from "./line.json";
import loss from "./loss.json";
import loh from "./loh.json";
import gain from "./gain.json"
//import "./styles.css";
const hovertip = (d =>{
  return "Value:" + d.value + "\n Start:" + d.start+"\n End:"+d.end+"\n Ancestry:"+d.ancestry+"\n Sex:"+d.sex;
})
const GRCh37 = [
  {"id":"chr1","label":"1","color":"#996600","len":249250621},
  {"id":"chr2","label":"2","color":"#666600","len":243199373},
  {"id":"chr3","label":"3","color":"#99991E","len":198022430},
  {"id":"chr4","label":"4","color":"#CC0000","len":191154276},
  {"id":"chr5","label":"5","color":"#FF0000","len":180915260},
  {"id":"chr6","label":"6","color":"#FF00CC","len":171115067},
  {"id":"chr7","label":"7","color":"#FFCCCC","len":159138663},
  {"id":"chr8","label":"8","color":"#FF9900","len":146364022},
  {"id":"chr9","label":"9","color":"#FFCC00","len":141213431},
  {"id":"chr10","label":"10","color":"#FFFF00","len":135534747},
  {"id":"chr11","label":"11","color":"#CCFF00","len":135006516},
  {"id":"chr12","label":"12","color":"#00FF00","len":133851895},
  {"id":"chr13","label":"13","color":"#358000","len":115169878},
  {"id":"chr14","label":"14","color":"#0000CC","len":107349540},
  {"id":"chr15","label":"5","color":"#6699FF","len":102531392},
  {"id":"chr16","label":"16","color":"#99CCFF","len":90354753},
  {"id":"chr17","label":"17","color":"#00FFFF","len":81195210},
  {"id":"chr18","label":"18","color":"#CCFFFF","len":78077248},
  {"id":"chr19","label":"19","color":"#9900CC","len":59128983},
  {"id":"chr20","label":"20","color":"#CC33FF","len":63025520},
  {"id":"chr21","label":"21","color":"#CC99FF","len":48129895},
  {"id":"chr22","label":"22","color":"#666666","len":51304566},
  {"id":"chrX","label":"X","color":"#999999","len":155270560},
  {"id":"chrY","label":"Y","color":"#CCCCCC","len":59373566}
]
export default function HeatMapTest() {
  return (
    <div >
      <Circos
          layout={layout}
          config={{
          ticks: {
            display: false,
            color: "black",
            spacing: 1,
            labels: false,
            labelSpacing: 10,
            labelSuffix: "",
            labelDenominator: 1,
            labelDisplay: true,
            labelSize: "5px",
            labelColor: "#000000",
            labelFont: "default",
            majorSpacing: 1
          },
           GRCh37,
          labels: {
            position: "center",
            display: true,
            size: 14,
            color: "#000",
            radialOffset: 17
          }
        }}
       tracks={[
          {
            type: STACK,
            data: loss, 
            config: {
              innerRadius: 0.25,
              outerRadius: 0.6,
              thickness:1,
              margin: 0,
              logScale: true,
              color: "red",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
                  color: "#f44336",
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
              innerRadius: 0.6,
              outerRadius: 0.8,
              thickness:1,
              margin: 0,
              logScale: true,
              color: "blue",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
                  color: "blue",
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
              innerRadius: 0.8,
              outerRadius: 1,
              thickness:1,
              margin: 0,
              logScale: true,
              color: "green",
              backgrounds: [
                {
                  start: 0,
                  end: 0.6,
                  color: "green",
                  opacity: 0.5
                }
              ],
              tooltipContent: function(d) {
                return hovertip(d);
              }
            }
          },
        ]}
        size={800}
      />
    </div>
  );
}
