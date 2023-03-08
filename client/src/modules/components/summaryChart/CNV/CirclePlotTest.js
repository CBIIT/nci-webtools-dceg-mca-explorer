import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Circos, {
  HIGHLIGHT,
  STACK
} from "react-circos";
import layout from "./layout2.json";
import band from "./band.json"
import SingleChart from "./SingleChart";


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
  return "<p style='text-align:left'>Sid: " +d.sampleId+ "<br> Study: "+ d.dataset+"<br> Type: "+d.type+ "<br> Cellular Fraction: "+ d.value + "<br> Start: " + d.start+"<br> End: "+d.end+"<br> Ancestry: "+d.ancestry+"<br> Sex: "+d.sex+"<br> Age: "+" "+"</p>";
})

const size = 800;

function changeBackground(track, chromesomeId, opacity){
         for(var t in track){
            const svgDoc = track[t];
            if (svgDoc.nodeName === "g"){
              if (svgDoc.__data__.key === chromesomeId){
                var s = svgDoc.querySelector('.background')
                //s.setAttribute("fill",color)
                s.setAttribute("opacity",opacity)
              }           
            }
  }}

export default function CirclePlotTest(props) {
  const [showChart, setShowChart] = useState(false);
  const [chromesomeId, setChromesomeId] = useState(0);

  const [circle, setCircle] = useState({
    loss:props.loss,
    gain:props.gain,
    loh:props.loh,
    undetermined:props.undetermined
  }
  );


  const circleRef = useRef(null);

  useEffect(() => {
    setCircle({
      loss:props.loss,
      gain:props.gain,
      loh:props.loh,
      undetermined:props.undetermined
    })
  },[props])


  const handleEnter= ()=> {
    if(circleRef.current){
        var track0 = circleRef.current.querySelectorAll('.track-0 .block')
        var track1 = circleRef.current.querySelectorAll('.track-1 .block');
        var track2 = circleRef.current.querySelectorAll('.track-2 .block');
        var track3 = circleRef.current.querySelectorAll('.track-3 .block');
        var alltracks = [track0,track1,track2,track3]
        alltracks.forEach(track => {
            track.forEach((b) => {
               const bck = b.querySelector(".background");
               bck.addEventListener('mouseover', () => {
                //console.log('mouseover',b.__data__.key);//b.__data__.key is the chromesome id 
                 alltracks.forEach(t => changeBackground(t,b.__data__.key,1))
               }) 
              bck.addEventListener('mouseout', () => {
                alltracks.forEach((t) => changeBackground(t,b.__data__.key,0.5))
               }) 
              bck.addEventListener('click', () => {
                //console.log("click",b.__data__.key)
                setShowChart(true);
                setChromesomeId(b.__data__.key);
               })        
            });    
        })
    }}

  const handleBack = ()=>{
    setShowChart(false);
  }
  // console.log(circle.loss)

//   const data = [
//     {name: 0.1, value:0,end:20,type:"GAIN"},
//     {name: 0.2, value:0,end:25,type:"GAIN"},
//     {name: 0.22, value:20,end:30,type:"GAIN"},
//     {name: 0.23, value:30,end:5,type:"GAIN"},
//     {name: 0.24, value:40,end:45,type:"GAIN"},
//     {name: 0.25, value:0,end:20,type:"GAIN"},
//     {name: 0.26, value:0,end:10,type:"LOSS"},
//     {name: 0.27, value:0,end:10,type:"LOSS"},
//     {name: 0.28, value:0,end:36,type:"LOSS"},
//     {name: 0.29, value:20,end:55,type:"LOSS"},
//     {name: 0.30, value:20,end:30,type:"LOSS"},
//     {name: 0.31, value:10,end:20,type:"LOSS"},
//     {name: 0.32, value:30,end:28,type:"LOSS"},
//     {name: 0.33, value:10,end:30,type:"NEUTRAL"},
//     {name: 0.34, value:10,end:40,type:"NEUTRAL"},
//     {name: 0.35, value:0,end:15,type:"NEUTRAL"},
//     {name: 0.36, value:12,end:20,type:"NEUTRAL"},
//     {name: 0.37, value:20,end:30,type:"NEUTRAL"},
//     {name: 0.38, value:40,end:50,type:"UNDETERMIND"},
//     {name: 0.39, value:0,end:30,type:"UNDETERMIND"},
// ]
const data = [...props.gain.filter(chr=>chr.block_id===chromesomeId),
        ...props.loh.filter(chr=>chr.block_id===chromesomeId),
        ...props.loss.filter(chr=>chr.block_id===chromesomeId),
        ...props.undetermined.filter(chr=>chr.block_id===chromesomeId)
    ]
   // console.log(data)

  return (
    <div className="align-middle text-center" >
      {showChart ? <div  ><SingleChart data={data}  width={600} height={400} /><button onClick={handleBack}>back</button></div>:
    <div ref={circleRef}  onMouseEnter={handleEnter} onClick={handleEnter}>
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
              },
              events: {
                // 'mouseover.alert':
                //   function(d, i, nodes, event) {
                //     //return hovercoler(d);
                // },
                // click:function(d, i, nodes, event) {
                //     return hovercoler(d);
                // }
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
              },
              events: {
              //  mouseover:
              //     function(d, i, nodes, event) {
              //       return hovercoler(d);
              //   },
                // click:function(d, i, nodes, event) {
                //     return hovercoler(d);
                // }
              
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
              //       return hovercoler(d);
              //   },
                // click:function(d, i, nodes, event) {
                //     return hovercoler(d);
                // }
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
                mouseover:
                function(d, i, nodes, event) {
                  //console.log(d.block_id);
                  //change class="cs-layout" class=d.block_id, fill="grey" to highlight the chromosome
                  //document.getElementsByClassName()

                }
              },
            },
          }
        ]}
        size={size}
      />
       
    </div>}
    </div>
  );
}
