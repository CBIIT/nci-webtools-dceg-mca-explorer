import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Circos, {
  HIGHLIGHT,
  STACK
} from "react-circos";
import layout from "./layout2.json";
import band from "./band.json"
import './css/circos.css'
import SingleChromosome from "./SingleChromosome";
import {  Row, Col,Button} from "react-bootstrap";
import { formState } from "../../../mosaicTiler/explore.state";
import { useRecoilState } from "recoil";

//import "./styles.css";
const hovertip = (d =>{
  return "<p style='text-align:left'>Sid: " +d.sampleId+ "<br> Study: "+ d.dataset+"<br> Type: "+d.type+ "<br> Cellular Fraction: "+ d.value + "<br> Start: " + d.start+"<br> End: "+d.end+"<br> Ancestry: "+d.ancestry+"<br> Sex: "+d.computedGender+"<br> Age: "+d.age+" "+"</p>";
})

const size = 800;

function changeBackground(track, chromesomeId, opacity){
         for(var t in track){
            const svgDoc = track[t];
            if (svgDoc.nodeName === "g"){
              if (svgDoc.__data__.key === chromesomeId ){
                var s = svgDoc.querySelector('.background')
                //s.setAttribute("fill","white")
                  s.setAttribute("opacity",opacity)
              }           
            }
  }}

export default function CirclePlotTest(props) {
  const [showChart, setShowChart] = useState(false);
  const [chromesomeId, setChromesomeId] = useState(0);
  const [form, setForm] = useRecoilState(formState);
  console.log(form)
  const [circle, setCircle] = useState({
    loss:props.loss,
    gain:props.gain,
    loh:props.loh,
    undetermined:props.undetermined,
    chrx: form.chrX,
    chry: form.chrY
  }
  );

  const circleRef = useRef(null);
  useEffect(() => {
    setCircle({
      loss:props.loss,
      gain:props.gain,
      loh:props.loh,
      undetermined:props.undetermined,
      chrx: props.chrx,
      chry: props.chry
    })
    //circleRef.current.focus();
  },[props])

  const sendClickedId = (id)=>{
    props.clickedChromoId(id);
  }

  const changeXYbackcolor=()=>{
     if(circleRef.current){
        var track0 = circleRef.current.querySelectorAll('.track-0 .block')
        var track1 = circleRef.current.querySelectorAll('.track-1 .block');
        var track2 = circleRef.current.querySelectorAll('.track-2 .block');
        var track3 = circleRef.current.querySelectorAll('.track-3 .block');
        var alltracks = [track0,track1,track2,track3]
        alltracks.forEach(track => {
            track.forEach((b) => {
              const bck = b.querySelector(".background");
              if(b.__data__.key === 'X' || b.__data__.key === 'Y'){
                bck.setAttribute("fill","white")
                bck.setAttribute("opacity",0)
              }                  
            });    
        })
    }
  }

   useEffect(() => {
        // call api or anything
        changeXYbackcolor()
     });
  const handleEnter= ()=> {
    console.log("handleEnter")
    if(circleRef.current){
        var track0 = circleRef.current.querySelectorAll('.track-0 .block')
        var track1 = circleRef.current.querySelectorAll('.track-1 .block');
        var track2 = circleRef.current.querySelectorAll('.track-2 .block');
        var track3 = circleRef.current.querySelectorAll('.track-3 .block');
        //var trackxy = circleRef.current.querySelectorAll('#chrxy .track-0');
        var alltracks = [track0,track1,track2,track3]
        alltracks.forEach(track => {
            track.forEach((b) => {
               const bck = b.querySelector(".background");
               bck.addEventListener('mouseover', () => {
                //console.log('mouseover',bck,b.__data__.key);//b.__data__.key is the chromesome id 
                if(b.__data__.key!=="X" && b.__data__.key!=="Y"){
                   alltracks.forEach(t => changeBackground(t,b.__data__.key,1))
                } 
                 else
                  alltracks.forEach(t => changeBackground(t,b.__data__.key,0.5))
               }) 
              bck.addEventListener('mouseout', () => {
                 if(b.__data__.key!=="X" && b.__data__.key!=="Y") 
                   alltracks.forEach((t) => changeBackground(t,b.__data__.key,0.5))
                  else
                    alltracks.forEach((t) => changeBackground(t,b.__data__.key,0))
               }) 
              bck.addEventListener('click', () => {
                //console.log("click",b.__data__.key)
                setShowChart(true);
                setChromesomeId(b.__data__.key);
                sendClickedId(b.__data__.key);
               })        
            });    
        })
    }}

  const handleBack = ()=>{
    setShowChart(false);
    sendClickedId(-1);
    props.onResetHeight();
  }
 
let data = []
data = [...props.gain.filter(chr=>chr.block_id===chromesomeId),
        ...props.loh.filter(chr=>chr.block_id===chromesomeId),
        ...props.loss.filter(chr=>chr.block_id===chromesomeId),
        ...props.undetermined.filter(chr=>chr.block_id===chromesomeId),
        ...props.chrx.filter(chr=>chr.block_id===chromesomeId),
        ...props.chry.filter(chr=>chr.block_id===chromesomeId),
        // ...props.chry.filter(chr=>chr.block_id===chromesomeId)
    ]
let dataCompared = []
const minage =  Number(form.minAge!==null?form.minAge:0)
const maxage =  Number(form.maxAge!==null?form.maxAge:1)
const ancestry = form.ancestry.length !==0 ?JSON.stringify(form.ancestry):''
const mincf = Number(form.minFraction!==null?form.minFraction:0)
const maxcf = Number(form.maxFraction!==null?form.maxFraction:1)
const sex = form.sex.length !==0 ?JSON.stringify(form.sex):""
//console.log(minage,maxage,mincf,maxcf)
data.forEach(d=>{
  if( (d.age !== undefined? Number(d.age) > minage && Number(d.age) < maxage :true) &&
      (sex ==='' ? true: d.computedGender !== undefined? sex.includes(d.computedGender):true) &&
      (ancestry === ''? true: d.ancestry !== undefined? ancestry.includes(d.ancestry):true) &&
      (d.cf !== undefined? Number(d.cf) > mincf && Number(d.cf) < maxcf:true)){
        dataCompared.push(d)
      }
})
//console.log(data,dataCompared)
const dataXY = [...props.chrx, ...props.chry] 
//console.log("gain:",props.gain.length,"loh:",props.loh.length,
//"loss:",props.loss.length,"under:",props.undetermined.length)
const linethickness = -1.75
const thicknessgain = props.gain.length<1000?0:linethickness;
const thicknessloh =  props.loh.length<1000?0:-1.9;
const thicknessloss =  props.loss.length<1000?0:linethickness;
const thicknessundermined =  props.undetermined.length<1000?0:linethickness;
//console.log(props.undetermined)

let layoutAll = !form.chrX || form.chrX===undefined? layout.filter(l=>l.label!=="X") : layout
layoutAll = !form.chrY|| form.chrY===undefined ? layoutAll.filter(l=>l.label!=="Y") : layoutAll

let singleFigWidth = form.compare?400:750 
return (
    <div className="align-middle text-center" >
        {
        showChart ? 
        <div>
          <p>Chromosome {chromesomeId}</p>
        <Row className="justify-content-center" >
          <Col >
            <SingleChromosome data={data} chromesomeId={chromesomeId}
             width={singleFigWidth} height={singleFigWidth} onHeightChange={props.onHeightChange}>
            </SingleChromosome>
            </Col>
            {form.compare?
            <Col >
            <SingleChromosome data={dataCompared} chromesomeId={chromesomeId}
             width={singleFigWidth} height={singleFigWidth} onHeightChange={props.onHeightChange}>
            </SingleChromosome>
          </Col>:''}
          </Row>
           <Button onClick={handleBack}>Back</Button></div>:
          <div>
            <div className="overlayX" id="chrxy">
                <Circos 
                    layout={layoutAll}
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
                      radialOffset: 28
                    }
                  }}
                  tracks={[
                    {
                      type: STACK,
                      data: dataXY, 
                      config: {
                        innerRadius: 0.05,
                        outerRadius: 1,
                        thickness:thicknessloss,
                        margin: 0,
                        strokeWidth: 1,
                        strokeColor:"red",
                        direction: 'out',
                        logScale: true,
                        color: "red",
                        backgrounds: [
                          {
                            start: 0,
                            end: 0,
                            color: "white",
                            opacity: 1
                          }
                        ],
                        tooltipContent: function(d) {
                          return hovertip(d)
                        },
                        events: {
                          mouseover:
                          function(d, i, nodes, event) {
                            console.log("mouse over");
                          },
                          click:function(d, i, nodes, event) {
                              console.log("mouse over");
                          }
                        }
                      }
                    }
                  ]}
                  size={size}
                />
            </div>
            <div className="overlayX" ref={circleRef}  onMouseEnter={handleEnter} onClick={handleEnter}>
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
                    radialOffset: 28
                  }
                }}
                tracks={[
                {
                    type: STACK,
                    data: circle.undetermined, 
                    config: {
                      innerRadius: 0.05,
                      outerRadius: 0.25,
                      thickness:thicknessundermined,
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
                      thickness:thicknessloss,
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
                      thickness:thicknessloh,
                      margin: 0,
                      strokeWidth: 1,
                      strokeColor: "blue",
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
                      thickness:thicknessgain,
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
            </div>
          </div>
          }
    </div>
  );
}
