import * as NGCircos from './lib/NGCircosPlot'
import { CNV01, BACKGROUND01, CNV02, BACKGROUND02, CNV03, BACKGROUND03 } from './data'

export default function  CircosPlot({data, onSelect}) {
// use NGCircos package to create circos plot
    var NGCircosGenome = [      // Configure your own genome here.
        [
          ["1", 248956422],
          ["2", 242193529],
          ["3", 198295559],
          ["4", 190214555],
          ["5", 181538259],
          ["6", 170805979],
          ["7", 159345973],
          ["8", 145138636],
          ["9", 138394717],
          ["10", 133797422],
          ["11", 135086622],
          ["12", 133275309],
          ["13", 114364328],
          ["14", 107043718],
          ["15", 101991189],
          ["16", 90338345],
          ["17", 83257441],
          ["18", 80373285],
          ["19", 58617616],
          ["20", 64444167],
          ["21", 46709983],
          ["22", 50818468]
          //  ["X" , 155270560],
          //  ["Y" , 59373566]
        ]
      ];
    var NGCircos01 = new NGCircos(CNV01, BACKGROUND01, CNV02, BACKGROUND02, CNV03, BACKGROUND03, NGCircosGenome, {       // Initialize NGCircos.js with "NGCircosGenome" and Main configuration
        zoom: true,
        target: "NGCircos",                              // Main configuration "target"
        svgWidth: 1200,                                  // Main configuration "svgWidth"
        svgHeight: 900,                                 // Main configuration "svgHeight"
        svgClassName: "NGCircos",                  // Main configuration "svgClassName"
        chrPad: 0.02,
        //outerRadius:300,
        //compareEventGroupGapRate: 1,
        //compareEventGroupDistance: 1,
        CNVMouseEvent: true,
        CNVMouseClickDisplay: true,
        CNVMouseClickColor: "red",
        CNVMouseClickArcOpacity: 1,
        CNVMouseClickArcStrokeColor: "#F26223",
        CNVMouseClickArcStrokeWidth: 0,
        CNVMouseClickTextFromData: "fourth",
        CNVMouseClickTextOpacity: 1,
        CNVMouseClickTextColor: "red",
        CNVMouseClickTextSize: 8,
        CNVMouseClickTextPostionX: 0,
        CNVMouseClickTextPostionY: 0,
        CNVMouseClickTextDrag: true,
        CNVMouseDownDisplay: true,
        CNVMouseDownColor: "green",
        CNVMouseDownArcOpacity: 1,
        CNVMouseDownArcStrokeColor: "#F26223",
        CNVMouseDownArcStrokeWidth: 0,
        CNVMouseEnterDisplay: true,
        CNVMouseEnterColor: "yellow",
        CNVMouseEnterArcOpacity: 1,
        CNVMouseEnterArcStrokeColor: "#F26223",
        CNVMouseEnterArcStrokeWidth: 0,
        CNVMouseLeaveDisplay: true,
        CNVMouseLeaveColor: "pink",
        CNVMouseLeaveArcOpacity: 1,
        CNVMouseLeaveArcStrokeColor: "#F26223",
        CNVMouseLeaveArcStrokeWidth: 0,
        CNVMouseMoveDisplay: true,
        CNVMouseMoveColor: "red",
        CNVMouseMoveArcOpacity: 1,
        CNVMouseMoveArcStrokeColor: "#F26223",
        CNVMouseMoveArcStrokeWidth: 0,
        CNVMouseOutDisplay: true,
        CNVMouseOutAnimationTime: 500,
        CNVMouseOutColor: "",//original is red if mouse moved there
        CNVMouseOutArcOpacity: 1,
        CNVMouseOutArcStrokeColor: "red",
        CNVMouseOutArcStrokeWidth: 0,
        CNVMouseUpDisplay: true,
        CNVMouseUpColor: "grey",
        CNVMouseUpArcOpacity: 1,
        CNVMouseUpArcStrokeColor: "#F26223",
        CNVMouseUpArcStrokeWidth: 0,
        CNVMouseOverDisplay: true,
        CNVMouseOverColor: "red",
        CNVMouseOverArcOpacity: 1,
        CNVMouseOverArcStrokeColor: "#F26223",
        CNVMouseOverArcStrokeWidth: 0,
      });
      NGCircos01.draw_genome(NGCircos01.genomeLength);  // NGCircos.js callback
      NGCircos01.draw_genome(NGCircos01.genomeLength2); // NGCircos2.js callback second time
}
