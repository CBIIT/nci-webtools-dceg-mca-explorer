/**
* NGCircos.js is an open source interactive Javascript library which 
* provides an easy way to interactive display biological data on the web.
* It implements a raster-based SVG visualization using the open source 
* Javascript framework jquery.js. NGCircos.js is multiplatform and works 
* in all major internet browsers (Internet Explorer, Mozilla Firefox, 
* Google Chrome, Safari, Opera). Its speed is determined by the client's 
* hardware and internet browser. For smoothest user experience, we recommend 
* Google Chrome.
*
* 
* @author <a href="cui_ya@163.com">Ya Cui</a>, <a href="cuizhe@hit.edu.cn">Zhe Cui</a>
* @version 1.1.0
*
* @example 
*      var NGCircosGenome = [
*         ["chr1" , 249250621],
*         ["chr2" , 243199373]
*      ];
*      NGCircos01 = new NGCircos(NGCircosGenome,{
*         target : "NGCircos",
*         svgWidth : 900,
*         svgHeight : 600
*      });
*      NGCircos01.draw_genome(NGCircos01.genomeLength);
*
**/
import $ from "jquery";
const d3 = require('d3');


//(function($){

export function NGCircos (){
      var self = this;
      const padding = 10;
      const width = 600;
      const height = 600;
      const dx = 10;
      const dy = width / (600 + padding);
      let x0 = Infinity;
      let x1 = -x0;
     
      const svg = d3.svg;
       console.log(svg)
        // .attr("viewBox", [(-dy * padding) / 2, x0 - dx, width, height])
        // .attr("width", width)
        // .attr("height", height)
        // .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
        // .attr("font-family", "sans-serif")
        // .attr("font-size", 12);
      if(arguments.length >= 2){
            self.argumentsNGCircosSettings=arguments[arguments.length-1];
            self.argumentsNGCircosGenome=arguments[arguments.length-2];

            self.CNV = new Array();
            self.CNVConfig = new Array();
            for (var n=0; n< arguments.length; n++){
                var reg=/^CNV/;
                if(reg.test(arguments[n][0])){
                    self.CNVConfig.push(arguments[n][1]);
                    self.CNV.push(arguments[n][2]);
                }
            }

     
            self.BACKGROUND = new Array();
            self.BACKGROUNDConfig = new Array();
            for (var n=0; n< arguments.length; n++){
                var reg=/^BACKGROUND/;
                if(reg.test(arguments[n][0])){
                    self.BACKGROUNDConfig.push(arguments[n][1]);
                    self.BACKGROUND.push(arguments[n][2]);
                }
            }

            self.TEXT = new Array();
            self.TEXTConfig = new Array();
            for (var n=0; n< arguments.length; n++){
                var reg=/^TEXT/;
                if(reg.test(arguments[n][0])){
                    self.TEXTConfig.push(arguments[n][1]);
                    self.TEXT.push(arguments[n][2]);
                }
            }
            
            self.LEGEND = new Array();
            self.LEGENDConfig = new Array();
            for (var n=0; n< arguments.length; n++){
              var reg=/^LEGEND/;
              if(reg.test(arguments[n][0])){
                self.LEGENDConfig.push(arguments[n][1]);
                self.LEGEND.push(arguments[n][2]);
              }
            }

      }else{
            document.getElementById(self.settings.target).innerHTML='Arguments Error: at least two arguments must supplied.<br>example: new NGCircos([FUSION01,CNV01,SNP01,]NGCircosGenome,{target : "NGCircos",zoom : true})';
      }

      self.settings = {
          "target" : "NGCircos",
          "svgWidth" : 900,
          "svgHeight" : 600,
          //zhec
          "svgClassName":"NGCircos",
          //zhec
          "chrPad" : 0.04,
          "innerRadius" : 246,
          "outerRadius" : 270,
          "zoom" : false,
          "compareEvent":false,
          "compareEventGroupGapRate":0.1,
          "compareEventGroupDistance":0,
          "genomeFillColor" : ["rgb(153,102,0)", "rgb(102,102,0)", "rgb(153,153,30)", "rgb(204,0,0)","rgb(255,0,0)", "rgb(255,0,204)", "rgb(255,204,204)", "rgb(255,153,0)", "rgb(255,204,0)", "rgb(255,255,0)", "rgb(204,255,0)", "rgb(0,255,0)","rgb(53,128,0)", "rgb(0,0,204)", "rgb(102,153,255)", "rgb(153,204,255)", "rgb(0,255,255)", "rgb(204,255,255)", "rgb(153,0,204)", "rgb(204,51,255)","rgb(204,153,255)", "rgb(102,102,102)", "rgb(153,153,153)", "rgb(204,204,204)"],
          //zhec 20190411
          "CNVxlink":false,
          //zhec 20190411
          "CNVMouseEvent" : true,
//          "CNVMouseCombinationEvent":false,
          "CNVMouseClickDisplay" : false,
          "CNVMouseClickColor" : "red",
          "CNVMouseClickArcOpacity" : 1.0,
          "CNVMouseClickArcStrokeColor" : "#F26223",
          "CNVMouseClickArcStrokeWidth" : 0,
          "CNVMouseClickTextFromData" : "fourth",   //first,second,third,fourth column
          "CNVMouseClickTextOpacity" : 1,
          "CNVMouseClickTextColor" : "red",
          "CNVMouseClickTextSize" : 8,
          "CNVMouseClickTextPostionX" : 0,
          "CNVMouseClickTextPostionY" : 0,
          "CNVMouseClickTextDrag" : true,
          "CNVMouseDownDisplay" : false,
          "CNVMouseDownColor" : "green",
          "CNVMouseDownArcOpacity" : 1.0,
          "CNVMouseDownArcStrokeColor" : "#F26223",
          "CNVMouseDownArcStrokeWidth" : 0,
          "CNVMouseEnterDisplay" : false,
          "CNVMouseEnterColor" : "yellow",
          "CNVMouseEnterArcOpacity" : 1.0,
          "CNVMouseEnterArcStrokeColor" : "#F26223",
          "CNVMouseEnterArcStrokeWidth" : 0,
          "CNVMouseLeaveDisplay" : false,
          "CNVMouseLeaveColor" : "pink",
          "CNVMouseLeaveArcOpacity" : 1.0,
          "CNVMouseLeaveArcStrokeColor" : "#F26223",
          "CNVMouseLeaveArcStrokeWidth" : 0,
          "CNVMouseMoveDisplay" : false,
          "CNVMouseMoveColor" : "red",
          "CNVMouseMoveArcOpacity" : 1.0,
          "CNVMouseMoveArcStrokeColor" : "#F26223",
          "CNVMouseMoveArcStrokeWidth" : 0,
          "CNVMouseOutDisplay" : false,
          "CNVMouseOutAnimationTime" : 500,
          "CNVMouseOutColor" : "red",
          "CNVMouseOutArcOpacity" : 1.0,
          "CNVMouseOutArcStrokeColor" : "red",
          "CNVMouseOutArcStrokeWidth" : 0,
          "CNVMouseUpDisplay" : false,
          "CNVMouseUpColor" : "grey",
          "CNVMouseUpArcOpacity" : 1.0,
          "CNVMouseUpArcStrokeColor" : "#F26223",
          "CNVMouseUpArcStrokeWidth" : 0,
          "CNVMouseOverDisplay" : false,
          "CNVMouseOverColor" : "red",
          "CNVMouseOverArcOpacity" : 1.0,
          "CNVMouseOverArcStrokeColor" : "#F26223",
          "CNVMouseOverArcStrokeWidth" : 3,
          "CNVMouseOverTooltipsSetting" : "style1", //custom, style1
          "CNVMouseOverTooltipsHtml" : " ",
          // "CNVMouseOverTooltipsHtml01" : "chr : ",
          // "CNVMouseOverTooltipsHtml02" : "<br>start : ",
          // "CNVMouseOverTooltipsHtml03" : "<br>end : ",
          // "CNVMouseOverTooltipsHtml04" : "<br>value : ",
          // "CNVMouseOverTooltipsHtml05" : "",
          "CNVMouseOverTooltipsPosition" : "absolute",
          "CNVMouseOverTooltipsBackgroundColor" : "white",
          "CNVMouseOverTooltipsBorderStyle" : "solid",
          "CNVMouseOverTooltipsBorderWidth" : 0,
          "CNVMouseOverTooltipsPadding" : "3px",
          "CNVMouseOverTooltipsBorderRadius" : "3px",
          "CNVMouseOverTooltipsOpacity" : 0.8,
        
          "genomeBorder" : {
             "display" : true,
             "borderColor" : "#000",
             "borderSize" : 0.5
          },
          "ticks" : {
             "display" : true,
             "len" : 5,
             "color" : "#000",
             "textSize" : 5,
             "textColor" : "#000",
             "scale" : 30000000,
            //zhec2
             "realLength" : false,
            //zhec2
            //offset from realLength
             "offset": 0 ,
            //offset from realLength
          },
          "genomeLabel" : {
             "display" : true,
             "textSize" :20,
             "textColor" : "#000",
             "dx" : 0.028,
             "dy" : "-0.6em"
          }
      };

      self.CNVsettings = {
          "compareGroup":1,
          "maxRadius": 200,
          "minRadius": 190,
          "CNVwidth": 10,
          "CNVColor": "#CAE1FF",
          "ValueAxisManualScale":false,
          "ValueAxisMaxScale":10,
          "ValueAxisMinScale":0,
          "strokeColor":"black",
          "strokeWidth":0,
          "opacity":1,
          "CNVAnimationDisplay": false,
          "CNVAnimationTime": 2000,
          "CNVAnimationDelay": 20,
          "CNVAnimationType": "bounce",  //linear,circle,elastic,bounce
      };

      // self.LABELsettings = {
      //     "compareGroup":1,
      //     "LABELSize": 10,
      //     "LABELWeight": "normal", //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
      //     "LABELColor": "#000",
      //     "LABELOpacity": 1.0
      // };

      self.BACKGROUNDsettings = {
          "compareGroup":1,
          "BginnerRadius": 180,
          "BgouterRadius": 230,
          "BgFillColor": "none",
          "BgborderColor": "#000",
          "BgborderSize" : 0.5,
          "axisShow": "false", 
          "axisWidth": 0.3,
          "axisColor": "#000",
          "axisOpacity": 0.5,
          "axisNum": 4,
          "BACKGROUNDAnimationDisplay": false,
          "BACKGROUNDAnimationTime": 2000,
          "BACKGROUNDAnimationDelay": 20,
          "BACKGROUNDAnimationType": "bounce",  //linear,circle,elastic,bounce    };
      };

      self.TEXTsettings = {
          "x": 20,
          "y": 20,
          "textSize": 10,
          "textWeight": "normal", //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
          "textColor": "#000",
          "textOpacity": 1.0,
          "rotateRate":0,
          "text": " ",
          "TEXTAnimationDisplay":false,
          "TEXTAnimationInitialSize":20,
          "TEXTAnimationInitialWeight":"bold",
          "TEXTAnimationInitialColor":"black",
          "TEXTAnimationInitialOpacity":1,
          "TEXTAnimationInitialPositionX":0,
          "TEXTAnimationInitialPositionY":0,
          "TEXTAnimationInitialRotate":0,
          "TEXTAnimationDelay":50,
          "TEXTAnimationTime":1000,
          "TEXTAnimationType":"linear",
      };
      
      self.LEGENDsettings = {
          "x": 20,
          "y": 20,
          "title": "legend",
          "titleSize": 6,
          "titleWeight": "normal",
          "GapBetweenGraphicText":5,
          "GapBetweenLines":15
      };

      self.update_settings(self.argumentsNGCircosSettings)

      self.target = "#" + self.settings.target;
      self.svgWidth = self.settings.svgWidth;
      self.svgHeight = self.settings.svgHeight;
      //zhec
      self.svgClassName=self.settings.svgClassName;
      //zhec
      self.chrPad = self.settings.chrPad;
      self.innerRadius = self.settings.innerRadius;
      self.outerRadius = self.settings.outerRadius;
      self.zoom = self.settings.zoom;
      self.testTip = self.settings.testTip;
      self.compareEvent = self.settings.compareEvent;
      self.genomeFillColor = self.settings.genomeFillColor;
      self.genomeBorderDisplay=self.settings.genomeBorder.display;
      self.genomeBorderColor=self.settings.genomeBorder.borderColor;
      self.genomeBorderSize=self.settings.genomeBorder.borderSize;
      if(self.compareEvent == false){
        self.genome = self.argumentsNGCircosGenome[0];
        self.genome_matrix(self.argumentsNGCircosGenome[0]);
        self.genome2 = 0;
        self.genome_matrix2(0);
      }else{
        self.genome = self.argumentsNGCircosGenome[0];
        self.genome_matrix(self.argumentsNGCircosGenome[0]);
        self.genome2 = self.argumentsNGCircosGenome[1];
        self.genome_matrix2(self.argumentsNGCircosGenome[1]);
      }
      self.ticksDisplay=self.settings.ticks.display;
      self.ticksLength=self.settings.ticks.len;
      self.ticksColor=self.settings.ticks.color;
      self.ticksTextSize=self.settings.ticks.textSize;
      self.ticksTextColor=self.settings.ticks.textColor;
      self.ticksScale=self.settings.ticks.scale;
      //zhec2
      self.ticksRealLength=self.settings.ticks.realLength
      //zhec2
      //offset
      self.ticksOffset=self.settings.ticks.offset
      //offset
      self.genomeTextDisplay=self.settings.genomeLabel.display;
      self.genomeTextSize=self.settings.genomeLabel.textSize;
      self.genomeTextColor=self.settings.genomeLabel.textColor;
      self.genomeTextDx=self.settings.genomeLabel.dx;
      self.genomeTextDy=self.settings.genomeLabel.dy;

      var labeli= self.genomeLabel.length;
      var initGenome = new Object();
      var initGenome2 = new Object();
      for(var labelk=0;labelk<labeli;labelk++){
          var labelInit=self.genomeLabel[labelk];
          initGenome[labelInit]=labelk;
      }
      for(var labelk=0;labelk<labeli;labelk++){
          var labelInit=self.genomeLabel2[labelk];
          initGenome2[labelInit]=labelk;
      }
      self.initGenome = initGenome;
      self.initGenome2 = initGenome2;

  }

  NGCircos.prototype.update_settings = function(settings_object){
    var self = this;
    $.extend(self.settings, settings_object);
  }

  NGCircos.prototype.update_CNVsettings = function(settings_object){
    var self = this;
    $.extend(self.CNVsettings, settings_object);
  }

  NGCircos.prototype.update_BACKGROUNDsettings = function(settings_object){
    var self = this;
    $.extend(self.BACKGROUNDsettings, settings_object);
  }

  NGCircos.prototype.update_TEXTsettings = function(settings_object){
    var self = this;
    $.extend(self.TEXTsettings, settings_object);
  }
  
  //legend
  NGCircos.prototype.update_LEGENDsettings = function(settings_object){
    var self = this;
    $.extend(self.LEGENDsettings, settings_object);
  }
  //legend

  NGCircos.prototype.init_CNVsettings = function(){
    var self = this;
    self.CNVsettings = {
          "compareGroup":1,
          "maxRadius": 200,
          "minRadius": 190,
          "CNVwidth": 10,
          "CNVColor": "#CAE1FF",
          "ValueAxisManualScale":false,
          "ValueAxisMaxScale":10,
          "ValueAxisMinScale":0,
          "strokeColor":"black",
          "strokeWidth":1,
          "opacity":1,
          "CNVAnimationDisplay": false,
          "CNVAnimationTime": 2000,
          "CNVAnimationDelay": 20,
          "CNVAnimationType": "bounce",  //linear,circle,elastic,bounce
    };
  }

  NGCircos.prototype.init_BACKGROUNDsettings = function(){
    var self = this;
    self.BACKGROUNDsettings = {
          "compareGroup":1,
          "BginnerRadius": 180,
          "BgouterRadius": 230,
          "BgFillColor": "none",
          "BgborderColor": "#000",
          "BgborderSize" : 0.5,
          "axisShow": "false",
          "axisWidth": 0.3,
          "axisColor": "#000",
          "axisOpacity": 0.5,
          "axisNum": 4,
          "BACKGROUNDAnimationDisplay": false,
          "BACKGROUNDAnimationTime": 2000,
          "BACKGROUNDAnimationDelay": 20,
          "BACKGROUNDAnimationType": "bounce",  //linear,circle,elastic,bounce    
        };
  }


  NGCircos.prototype.init_TEXTsettings = function(){
    var self = this;
    self.TEXTsettings = {
          "x": 20,
          "y": 20,
          "textSize": 10,
          "textColor": "#000",
          "textWeight": "normal", //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
          "textOpacity": 1.0,
          "rotateRate":0,
          "text": " ",
          "TEXTAnimationDisplay":false,
          "TEXTAnimationInitialSize":20,
          "TEXTAnimationInitialWeight":"bold",
          "TEXTAnimationInitialColor":"black",
          "TEXTAnimationInitialOpacity":1,
          "TEXTAnimationInitialPositionX":0,
          "TEXTAnimationInitialPositionY":0,
          "TEXTAnimationInitialRotate":0,
          "TEXTAnimationDelay":50,
          "TEXTAnimationTime":1000,
          "TEXTAnimationType":"linear",
    };
  }
  
  //legend
  NGCircos.prototype.init_LEGENDsettings = function(){
    var self = this;
    self.LEGENDsettings = {
          "x": 20,
          "y": 20,
          "title": "legend",
          "titleSize": 6,
          "titleWeight": "normal",
          "GapBetweenGraphicText":5,
          "GapBetweenLines":15
    };
  }

  //legend

  NGCircos.prototype.genome_matrix = function(genome){
      var self = this;
      var i=self.genome.length;
      var genomeLabel = new Array();
      var genomeLength = new Array();
      if(self.compareEvent == true){
        genomeLabel[0]="fake1Gap1";
        for(var k=0;k<i;k++){
            genomeLabel[k+1]=self.genome[k][0];
        }
        genomeLabel[i+1]="fake1Gap2";
        var genomeGap = 0;
        for(var k=0;k<i;k++){
            genomeGap += self.genome[k][1]
        }
        genomeGap=genomeGap*self.settings.compareEventGroupGapRate
        genomeLength[0]=genomeGap;
        for(var k=0;k<i;k++){
            genomeLength[k+1]=self.genome[k][1];
        }
        genomeLength[i+1]=genomeGap;
        genomeLabel[i+2]="fake1Gap3";
        for(var k=i;k<2*i;k++){
            genomeLabel[k+3]="fake1"+self.genome[2*i-1-k][0];
        }
        genomeLabel[2*i+3]="fake1Gap4";
        genomeLength[i+2]=genomeGap;
        for(var k=i;k<2*i;k++){
            genomeLength[k+3]=self.genome[2*i-1-k][1];
        }
        genomeLength[2*i+3]=genomeGap;
      }else{
        for(var k=0;k<i;k++){
          genomeLabel[k]=self.genome[k][0];
        }
        for(var k=0;k<i;k++){
          genomeLength[k]=self.genome[k][1];
        }
      }
      
      var i=genomeLength.length;
      var p=genomeLength.length;
      var genome = new Array();
      for(var k=0;k<i;k++){ 
         genome[k]=new Array();
           for(var j=0;j<p;j++){
              genome[k][j]=0;
           }
      }
      for(var k=0;k<i;k++){
         genome[k][0]=genomeLength[k];
      }
      self.genomeLabel = genomeLabel;
      self.genomeLength = genome;
      //console.log(self.genomeLabel)
//      console.log(self.genomeLength)
  }
  
  //compare
  NGCircos.prototype.genome_matrix2 = function(genome){
      var self = this;
      if(genome == 0){
        self.genomeLabel2 = 0;
        self.genomeLength2 = 0;
      }else{
        var i=self.genome2.length;
        var genomeLabel2 = new Array();
        var genomeLength2 = new Array();
        var genomeGap = 0;
        for(var k=0;k<i;k++){
            genomeGap += self.genome[k][1]
        }
        genomeGap=genomeGap*self.settings.compareEventGroupGapRate

        genomeLabel2[0]="fake2Gap1";
        genomeLabel2[i+1]="fake2Gap2";
        genomeLabel2[i+2]="fake2Gap3";
        genomeLabel2[2*i+3]="fake2Gap4";
        genomeLength2[0]=genomeGap;
        genomeLength2[i+1]=genomeGap;
        genomeLength2[i+2]=genomeGap;
        genomeLength2[2*i+3]=genomeGap;
        for(var k=i;k<2*i;k++){
          genomeLabel2[k+3]=self.genome2[2*i-1-k][0];
        }
        for(var k=0;k<i;k++){
           genomeLabel2[k+1]="fake2"+self.genome2[k][0];
        }
        for(var k=0;k<i;k++){
           genomeLength2[k+1]=self.genome2[k][1];
        }
        for(var k=i;k<2*i;k++){
            genomeLength2[k+3]=self.genome2[2*i-1-k][1];
        }
        var i=genomeLength2.length;
        var p=genomeLength2.length;
        var genome = new Array();
        for(var k=0;k<i;k++){ 
          genome[k]=new Array();
            for(var j=0;j<p;j++){
              genome[k][j]=0;
            }
        }
        for(var k=0;k<i;k++){
          genome[k][0]=genomeLength2[k];
        }
        self.genomeLabel2 = genomeLabel2;
        self.genomeLength2 = genome;
      }
     // console.log(self.genomeLabel2)
  }
  //compare

  NGCircos.prototype.cnv_value_maxmin = function(cnvIn){
      var self = this;
      var i=cnvIn.length;
      var cnvValueList = new Array();
      for(var k=0;k<i;k++){
          cnvValueList[k]=cnvIn[k].value;
      }
      
      if(self.CNVsettings.ValueAxisManualScale == true){
        cnvValueList[i]=self.CNVsettings.ValueAxisMaxScale
        cnvValueList[i+1]=self.CNVsettings.ValueAxisMinScale
      }
      
      Array.max=function(array){
          return Math.max.apply(Math,array);
      }
      Array.min=function(array){
         return Math.min.apply(Math,array);
      }
      var cnvValueMax = Array.max(cnvValueList);
      var cnvValueMin = Array.min(cnvValueList);
      var cnvValueMaxmin = new Array();
      cnvValueMaxmin[0]=cnvValueMax;
      cnvValueMaxmin[1]=cnvValueMin;
      return cnvValueMaxmin;
  }
  
  //SNPr2class
  NGCircos.prototype.snp_r2Value_color = function(r2Value){
      var self = this;
      if(parseFloat(r2Value) < 0.2){
        return self.SNPsettings.SNPFillr2Color[0]
      }else if(parseFloat(r2Value) < 0.4){
        return self.SNPsettings.SNPFillr2Color[1]
      }else if(parseFloat(r2Value) < 0.6){
        return self.SNPsettings.SNPFillr2Color[2]
      }else if(parseFloat(r2Value) < 0.8){
        return self.SNPsettings.SNPFillr2Color[3]
      }else{
        return self.SNPsettings.SNPFillr2Color[4]
      }
  }
  //SNPr2class
  
  var drawTime=0
  NGCircos.prototype.draw_genome = function(genome){
    //console.log(genome)
    drawTime += 1
    if(genome == 0 ){
      return;
    }
    var self = this;
    if(drawTime == 2){
      self.genomeLabel=self.genomeLabel2
      self.initGenome=self.initGenome2
    }
    //console.log(self.initGenome)
    //console.log(self.genomeLabel)
    //console.log(d3)
    var chord = d3.layout.chord()
      .padding(self.chrPad)
      .sortSubgroups(d3.descending)
      .matrix(genome);

    var width = self.svgWidth,
      height = self.svgHeight,
      svgClassName=self.svgClassName,
      innerRadius = self.innerRadius,
      outerRadius = self.outerRadius;
    var circleCenter=width/2
    var compareMoveDistance = 0
    if(self.settings.compareEvent == true){
      if(drawTime == 1){
        compareMoveDistance = self.settings.compareEventGroupDistance/2
      }
      if(drawTime == 2){
        compareMoveDistance = -1*self.settings.compareEventGroupDistance/2
      }
    }
    //console.log(compareMoveDistance)

//    if(self.settings.CNVMouseCombinationEvent == true || self.settings.SNPMouseCombinationEvent == true){
//      width = 2*width
//      circleCenter= width/4
//    }
      
      if(self.settings.SNPMouseCombinationEvent == true){
        width = 2*width
        circleCenter= width/4
      }
      
    var fill = d3.scale.ordinal()
        .domain(d3.range(4))
        .range(self.genomeFillColor);
    
    let zoompos = 0;
    let zoompos2 = 0;
    if(drawTime == 1){
      if(self.zoom == true){
          function zoom() {
            //console.log(d3.event.scale)
              zoompos =d3.event.translate[0]
              zoompos2 =d3.event.translate[1]
              var a=d3.event.translate[0]+circleCenter / 2
              var b=d3.event.translate[1]+height / 2
              svg.attr("transform", "translate(" 
                  + a +","+ b 
                  + ")scale(" + d3.event.scale + ")");
          }
          var svg = d3.select(self.target).append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class",svgClassName)
              .attr("id",svgClassName)
              .call(
                   d3.behavior.zoom()
                   .scaleExtent([0.9, 10])
                   .on("zoom", zoom)
              )
            .append("g")
//              .attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
              .attr("transform", "translate(" + circleCenter + "," + height / 2 + ")");

      }else{
          var svg = d3.select(self.target).append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class",svgClassName)
              .attr("id",svgClassName)
            .append("g")
//              .attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
              .attr("transform", "translate(" + circleCenter + "," + height / 2 + ")");
      }
    }else{
//      var svg = d3.select(self.target).select("svg").select("g").attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
      var svg = d3.select(self.target).select("svg").select("g").attr("transform", "translate(" + circleCenter + "," + height / 2 + ")");
//      if(self.zoom == true){
//          function zoom() {
//              a=d3.event.translate[0]+circleCenter / 2
//              b=d3.event.translate[1]+height / 2
//              svg.attr("transform", "translate(" 
//                  + a +","+ b 
//                  + ")scale(" + d3.event.scale + ")");
//          }
//          var svg = d3.select(self.target).select("svg")
//              .attr("width", width)
//              .attr("height", height)
//              .call(
//                    d3.behavior.zoom()
//                    .scaleExtent([0.9, 10])
//                    .on("zoom", zoom)
//              )
//              .append("g")
//              .attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
//
//      }else{
//          var svg = d3.select(self.target).select("svg")
//              .attr("width", width)
//              .attr("height", height)
//              .append("g")
//              .attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
//      }
      
    }
    
    //console.log(self.genomeLabel)
    if(self.genomeBorderDisplay == true){
        svg.append("g").selectAll("path")
            .data(chord.groups)
          .enter().append("path")
            .style("fill", function(d) { return fill(d.index); })
            .style("stroke", self.genomeBorderColor)
            .style("stroke-width", self.genomeBorderSize)
            .style("fill-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
            .style("stroke-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")")
            .attr("name", function(d) { return d.index+1; });
    }else{
        svg.append("g").selectAll("path")
            .data(chord.groups)
          .enter().append("path")
            .style("fill", function(d) { return fill(d.index); })
            .style("stroke", function(d) { return fill(d.index); })
            .style("fill-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
            .style("stroke-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")")
            .attr("name", function(d) { return d.index+1; });
    }

    if(self.genomeTextDisplay == true){
        svg.append("g").selectAll("text")
            .data(chord.groups)
          .enter().append("text")
            .style("fill", self.genomeTextColor)
            .style("font-size", self.genomeTextSize)
            .style("fill-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
	    .each( function(d,i) { 
               d.angle = (d.startAngle + d.endAngle) / 2 - self.genomeTextDx;
               d.name = self.genomeLabel[i];
            })
	    .attr("dy",self.genomeTextDy)
	    .attr("transform", function(d){
          if(drawTime == 1){
            return "rotate(" + ( d.angle * 180 / Math.PI ) + ")" +
            	       "translate(0,"+ (-1.0*(outerRadius+10)-compareMoveDistance) +")" +
            	       ( ( d.angle > Math.PI*2 && d.angle < Math.PI*0 ) ? "rotate(180)" : "");
          }
          if(drawTime == 2){
            return "rotate(" + ( d.angle * 180 / Math.PI ) + ")" +
            	       "translate(0,"+ (-1.0*(outerRadius+10)+compareMoveDistance) +")" +
            	       ( ( d.angle > Math.PI*2 && d.angle < Math.PI*0 ) ? "rotate(180)" : "");
          }
	       
	    })
	    .text(function(d){
	       return d.name;
	    });
    }

    if(self.ticksDisplay == true){
        function groupTicks(d) {
          var k = (d.endAngle - d.startAngle) / d.value;
          return d3.range(0, d.value, self.ticksScale).map(function(v, i) {
            return {
              angle: v * k + d.startAngle,
    
              label: v / self.ticksScale + "",
              index: d.index
              
            };
          });
        }

        var ticks = svg.append("g").selectAll("g")
            .data(chord.groups)
          .enter().append("g").selectAll("g")
            .data(groupTicks)
          .enter().append("g")
            .attr("transform", function(d) {
//              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
//                  + "translate(" + (outerRadius - 0) + ",0)";
              return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                  + "translate(" + (outerRadius - 0+Math.sin(d.angle)*compareMoveDistance) + ","+Math.cos(d.angle)*compareMoveDistance+")";
//              return "translate(" + (Math.sin(d.angle)*(outerRadius - 0)+compareMoveDistance) + ","+-1*Math.cos(d.angle)*(outerRadius-0)+")";
            });

        ticks.append("line")
            .attr("x1", 1)
            .attr("y1", 0)
            .attr("x2", self.ticksLength)
            .attr("y2", 0)
            .style("stroke", self.ticksColor)
            .style("stroke-opacity",function (d) {
//                console.log(d)
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            });

        ticks.append("text")
            .attr("x", 8)
            .attr("dy", ".35em")
            .style("font-size", self.ticksTextSize)
            .style("fill", self.ticksTextColor)
            .style("fill-opacity",function (d) {
                var reg=/^fake/;
                if(reg.test(self.genomeLabel[d.index])){
                  return 0;
                }else{
                  return 1;
                }
            })
            .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180)translate(-16)" : null; })
            .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
            .text(function(d) { 
              if(self.ticksRealLength == true){
                if(self.ticksOffset != undefined){
                  return (d.label*self.ticksScale + self.ticksOffset);
                }else{
                  return d.label*self.ticksScale;
                }
              }else {
                if(self.ticksOffset != undefined){
                  return (d.label + self.ticksOffset);
                }else{
                  return d.label;
                }
              }
               });

       let clicktimes = 1;
       d3.select("#zoom_in").on("click", function() {
        clicktimes = clicktimes+1;
        //zoom.scaleBy(svg.transition().duration(750), 1.2);
             var a=zoompos + circleCenter / 2
             var b=zoompos2 + height / 2
            svg.attr("transform", "translate("+ a +","+ b 
                        + ")scale(" + 1.2*clicktimes + ")");
             console.log("zoom in "+d3.event.x+" a: "+a);
            //  d3.event.x = a;
            //  d3.event.y = b;
          });
          d3.select("#zoom_out").on("click", function() {
        //zoom.scaleBy(svg.transition().duration(750), 0.8);
            clicktimes = clicktimes-1;
            let a=zoompos+circleCenter / 2
            let b=zoompos+height / 2
            if (clicktimes <=0) clicktimes = 0;
            svg.attr("transform", "translate("+ a +","+ b 
                        + ")scale(" + clicktimes + ")");
             console.log("zoom out "+clicktimes);
          });
          }

    var drag = d3.behavior.drag()
              .on("drag", dragmove);

    function dragmove(d) {
        d3.select(this)
          .attr("x", d3.event.x )
          .attr("y", d3.event.y );
    }

    //var draglinklabel = d3.behavior.drag()
    //          .on("drag", draglinkmove);

    //function draglinkmove(d) {
    //    d3.select(this)
    //      .attr("x", d3.event.x )
    //      .attr("y", d3.event.y );
    //}

    if(self.BACKGROUND.length > 0){
        for(var backgroundi=0; backgroundi<self.BACKGROUND.length; backgroundi++){
            self.update_BACKGROUNDsettings(self.BACKGROUNDConfig[backgroundi]);
            if(drawTime == self.BACKGROUNDsettings.compareGroup){
              if(self.BACKGROUNDsettings.BACKGROUNDAnimationDisplay == false){
                svg.append("g").selectAll("path")
                  .data(chord.groups)
                  .enter()
                  .append("path")
                  .filter(function (d,i) {
                    if(self.settings.compareEvent == true){
                      if(self.BACKGROUNDsettings.compareGroup == 1){
                        return (i>0 && i<(self.genome.length+1));
                      }
                      if(self.BACKGROUNDsettings.compareGroup == 2){
                        return (i>(self.genome.length+2) && i<(self.genome.length*2+3));
                      }
                    }else{
                      return true;
                    }
                  })
                  .style("fill", self.BACKGROUNDsettings.BgFillColor)
                  .style("stroke", self.BACKGROUNDsettings.BgborderColor)
                  .style("stroke-width", self.BACKGROUNDsettings.BgborderSize)
                  .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius).outerRadius(self.BACKGROUNDsettings.BgouterRadius))
                  .attr("transform", function (d,i) {
                    return "translate(" + compareMoveDistance + "," + 0 + ")";
                  })

                if(self.BACKGROUNDsettings.axisShow=="true"){
                    for(var i=1;i<=self.BACKGROUNDsettings.axisNum;i++){
                        svg.append("g").selectAll("path")
                            .data(chord.groups)
                          .enter().append("path")
                          .filter(function (d,i) {
                            if(self.settings.compareEvent == true){
                              if(self.BACKGROUNDsettings.compareGroup == 1){
                                return (i>0 && i<(self.genome.length+1));
                              }
                              if(self.BACKGROUNDsettings.compareGroup == 2){
                                return (i>(self.genome.length+2) && i<(self.genome.length*2+3));
                              }
                            }else{
                              return true;
                            }
                            })
                            .style("fill", "none")
                            .style("opacity",self.BACKGROUNDsettings.axisOpacity)
                            .style("stroke", self.BACKGROUNDsettings.axisColor)
                            .style("stroke-width", self.BACKGROUNDsettings.axisWidth)
                            .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius+(self.BACKGROUNDsettings.BgouterRadius-self.BACKGROUNDsettings.BginnerRadius)/(self.BACKGROUNDsettings.axisNum+1)*i).outerRadius(self.BACKGROUNDsettings.BginnerRadius+(self.BACKGROUNDsettings.BgouterRadius-self.BACKGROUNDsettings.BginnerRadius)/(self.BACKGROUNDsettings.axisNum+1)*i+self.BACKGROUNDsettings.axisWidth))
                            .attr("transform", function (d,i) {
                                return "translate(" + compareMoveDistance + "," + 0 + ")";
                            })
                    }
                }
              }
              if(self.BACKGROUNDsettings.BACKGROUNDAnimationDisplay == true){
                svg.append("g").selectAll("path")
                  .data(chord.groups)
                  .enter()
                  .append("path")
                  .filter(function (d,i) {
                    if(self.settings.compareEvent == true){
                      if(self.BACKGROUNDsettings.compareGroup == 1){
                        return (i>0 && i<(self.genome.length+1));
                      }
                      if(self.BACKGROUNDsettings.compareGroup == 2){
                        return (i>(self.genome.length+2) && i<(self.genome.length*2+3));
                      }
                    }else{
                      return true;
                    }
                  })
                  .style("fill", self.BACKGROUNDsettings.BgFillColor)
                  .style("stroke", self.BACKGROUNDsettings.BgborderColor)
                  .style("stroke-width", self.BACKGROUNDsettings.BgborderSize)
                  .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius).outerRadius(self.BACKGROUNDsettings.BginnerRadius))
                  .attr("transform", function (d,i) {
                    return "translate(" + compareMoveDistance + "," + 0 + ")"
                  })
                  .transition()
                  .delay(function (d,i) {
                    return (i+1) *self.BACKGROUNDsettings.BACKGROUNDAnimationDelay;
                  })
                  .duration(self.BACKGROUNDsettings.BACKGROUNDAnimationTime)
                  .ease(self.BACKGROUNDsettings.BACKGROUNDAnimationType)
                  .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius).outerRadius(self.BACKGROUNDsettings.BgouterRadius));

                if(self.BACKGROUNDsettings.axisShow=="true"){
                    for(i=1;i<=self.BACKGROUNDsettings.axisNum;i++){
                        svg.append("g").selectAll("path")
                            .data(chord.groups)
                          .enter().append("path")
                          .filter(function (d,i) {
                            if(self.settings.compareEvent == true){
                              if(self.BACKGROUNDsettings.compareGroup == 1){
                                return (i>0 && i<(self.genome.length+1));
                              }
                              if(self.BACKGROUNDsettings.compareGroup == 2){
                                return (i>(self.genome.length+2) && i<(self.genome.length*2+3));
                              }
                            }else{
                              return true;
                            }
                            })
                            .style("fill", "none")
                            .style("opacity",self.BACKGROUNDsettings.axisOpacity)
                            .style("stroke", self.BACKGROUNDsettings.axisColor)
                            .style("stroke-width", self.BACKGROUNDsettings.axisWidth)
                            .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius).outerRadius(self.BACKGROUNDsettings.BginnerRadius))
                            .attr("transform", function (d,i) {
                                return "translate(" + compareMoveDistance + "," + 0 + ")";
                            })
                            .transition()
                            .delay(function (d,i) {
                              return (i+1) *self.BACKGROUNDsettings.BACKGROUNDAnimationDelay;
                            })
                            .duration(self.BACKGROUNDsettings.BACKGROUNDAnimationTime)
                            .ease(self.BACKGROUNDsettings.BACKGROUNDAnimationType)
                            .attr("d", d3.svg.arc().innerRadius(self.BACKGROUNDsettings.BginnerRadius+(self.BACKGROUNDsettings.BgouterRadius-self.BACKGROUNDsettings.BginnerRadius)/(self.BACKGROUNDsettings.axisNum+1)*i).outerRadius(self.BACKGROUNDsettings.BginnerRadius+(self.BACKGROUNDsettings.BgouterRadius-self.BACKGROUNDsettings.BginnerRadius)/(self.BACKGROUNDsettings.axisNum+1)*i+self.BACKGROUNDsettings.axisWidth))
                    }
                }
              }

              
            }
            self.init_BACKGROUNDsettings();

        }
    }

    if(self.TEXT.length > 0 && drawTime == 1){
        for(var texti=0; texti<self.TEXT.length; texti++){
            self.update_TEXTsettings(self.TEXTConfig[texti]);
              if(self.TEXTsettings.TEXTAnimationDisplay == false){
                svg.append("text")
                 .attr("x", 0)
                 .attr("y", 0)
                 .style("opacity", self.TEXTsettings.textOpacity)
                 .style("font-size", self.TEXTsettings.textSize)
                 .style("font-weight", self.TEXTsettings.textWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
                 .attr("fill", self.TEXTsettings.textColor)
                 .attr("class", "dragText")
                 .attr("transform",function (d) {
                  return "translate("+self.TEXTsettings.x+" "+self.TEXTsettings.y+") rotate("+ self.TEXTsettings.rotateRate*180 + ")"
                })
                 .text(self.TEXTsettings.text);
              }
              if(self.TEXTsettings.TEXTAnimationDisplay == true){
                svg.append("text")
                 .attr("x", 0)
                 .attr("y", 0)
                 .style("opacity", self.TEXTsettings.TEXTAnimationInitialOpacity)
                 .style("font-size", self.TEXTsettings.TEXTAnimationInitialSize)
                 .style("font-weight", self.TEXTsettings.TEXTAnimationInitialWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
                 .attr("fill", self.TEXTsettings.TEXTAnimationInitialColor)
                 .attr("class", "dragText")
                 .attr("transform",function (d) {
                  return "translate("+self.TEXTsettings.TEXTAnimationInitialPositionX+" "+self.TEXTsettings.TEXTAnimationInitialPositionY+") rotate("+ self.TEXTsettings.TEXTAnimationInitialRotate*180 + ")"
                })
                 .text(self.TEXTsettings.text)
                  .transition()
                  .delay(function (d,i) {
                    return self.TEXTsettings.TEXTAnimationDelay;
                  })
                  .duration(self.TEXTsettings.TEXTAnimationTime)
                  .ease(self.TEXTsettings.TEXTAnimationType)
                 .attr("transform",function (d) {
                  return "translate("+self.TEXTsettings.x+" "+self.TEXTsettings.y+") rotate("+ self.TEXTsettings.rotateRate*180 + ")"
                }); 
              }
            self.init_TEXTsettings();
        }
        if(self.settings.TEXTModuleDragEvent==true){
            svg.selectAll("text.dragText").call(drag);
        }

    }
    
    //legend
    if(self.LEGEND.length > 0 && drawTime == 1){
      function NGCircosLEGEND(d) {
          return self.LEGEND[legendi].map(function(v, i) {
//            console.log(i)
            return {
              legend_x: self.LEGENDsettings.x+15,
              legend_y: self.LEGENDsettings.y+self.LEGENDsettings.titleSize+self.LEGENDsettings.GapBetweenLines*i,
              legend_type:v.type,
              legend_color:v.color,
              legend_opacity:v.opacity,
              legend_circleSize:v.circleSize,
              legend_rectSize:v.rectSize,
              legend_lineWidth:v.lineWidth,
              legend_lineHeight:v.lineHeight,
              legend_text:v.text,
              legend_textSize:v.textSize,
              legend_textWeight:v.textWeight,
              
              
            };
          });
        }
      for(var legendi=0; legendi<self.LEGEND.length; legendi++){
        self.update_LEGENDsettings(self.LEGENDConfig[legendi]);
          svg.append("text")
           .attr("x", self.LEGENDsettings.x)
           .attr("y", self.LEGENDsettings.y)
           .style("font-size", self.LEGENDsettings.titleSize)
           .style("font-weight", self.LEGENDsettings.titleWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
           .attr("fill", "black")
           .text(self.LEGENDsettings.title);
          
        var legend_objects = NGCircosLEGEND(chord.groups())
//        console.log(legend_objects)
          for(var objecti=0; objecti<legend_objects.length;objecti++){
              var legend_objects_circle= new Array();
              var legend_objects_line = new Array();
              var legend_objects_rect= new Array();
              if(legend_objects[objecti].legend_type == "circle"){
                legend_objects_circle[0] =legend_objects[objecti]
                //console.log(legend_objects_circle)
                svg.append("g")
                  .attr("class", "NGCircosLEGEND")
                  .selectAll("circle")
                  .data(legend_objects_circle)
                  .enter()
                  .append("circle")
                  .attr("id", "NGCircosLEGENDCircle")
                  .attr("fill", function(d) { return d.legend_color; })
                  .attr("opacity", function(d) { return d.legend_opacity; })
                  .attr("r", function(d) { return d.legend_circleSize; })
                  .attr("cx", function(d) { return d.legend_x; })
                  .attr("cy", function(d) { return d.legend_y; });
                
                var textX=parseInt(legend_objects[objecti].legend_x)+parseInt(legend_objects[objecti].legend_circleSize)+self.LEGENDsettings.GapBetweenGraphicText
                var textY=parseInt(legend_objects[objecti].legend_y)+parseInt(legend_objects[objecti].legend_circleSize)/2
                svg.append("text")
                 .attr("x", textX)
                 .attr("y", textY)
                 .style("font-size", legend_objects[objecti].legend_textSize)
                 .style("font-weight", legend_objects[objecti].legend_textWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
                 .attr("fill", "black")
                 .text(legend_objects[objecti].legend_text);

              }
              if(legend_objects[objecti].legend_type == "line"){
                legend_objects_line[0] = legend_objects[objecti]
//                console.log(legend_objects_line)
                var start_x=parseInt(legend_objects[objecti].legend_x)-parseInt(legend_objects[objecti].legend_lineWidth)/2
                var end_x=parseInt(legend_objects[objecti].legend_x)+parseInt(legend_objects[objecti].legend_lineWidth)/2
                var start_y=parseInt(legend_objects[objecti].legend_y)
                var end_y=parseInt(legend_objects[objecti].legend_y)
                var data=[[start_x,start_y],[end_x,end_y]]
//                console.log(data)
                var lineGenerator = d3.svg.line()
                                  .x(function(d) {
                                      return d[0]
                                  })
                                  .y(function(d) {
                                      return d[1];
                                  });
                svg.append("g")
                  .attr("class", "NGCircosLEGEND")
                  .selectAll("path")
                  .data(legend_objects_line)
                  .enter()
                  .append("path")
                  .attr("id", "NGCircosLEGENDLine")
                  .attr("d", lineGenerator(data))
                  .attr("stroke",function(d) { return d.legend_color; })
                  .attr("stroke-width",function(d) { return d.legend_lineHeight; })
                  .attr("fill","none");
                  
                textX=parseInt(legend_objects[objecti].legend_x)+parseInt(legend_objects[objecti].legend_lineWidth)+self.LEGENDsettings.GapBetweenGraphicText
                textY=parseInt(legend_objects[objecti].legend_y)+parseInt(legend_objects[objecti].legend_lineHeight)/2
                svg.append("text")
                 .attr("x", textX)
                 .attr("y", textY)
                 .style("font-size", legend_objects[objecti].legend_textSize)
                 .style("font-weight", legend_objects[objecti].legend_textWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
                 .attr("fill", "black")
                 .text(legend_objects[objecti].legend_text);

                
              }
              if(legend_objects[objecti].legend_type == "rect"){
                legend_objects_rect[0]=legend_objects[objecti]
                svg.append("g")
                  .attr("class", "NGCircosLEGEND")
                  .selectAll("rect")
                  .data(legend_objects_rect)
                  .enter()
                  .append("rect")
                  .attr("id", "NGCircosLEGENDRect")
                  .attr("x", function(d) { return d.legend_x-d.legend_rectSize/2; })
                  .attr("y", function(d) { return d.legend_y-d.legend_rectSize/2; })
                  .attr("fill", function(d) { return d.legend_color; })
                  .attr("width", function(d) { return d.legend_rectSize; })
                  .attr("height", function(d) { return d.legend_rectSize; })
                  .attr("opacity", function(d) { return d.legend_opacity; });

                textX=parseInt(legend_objects[objecti].legend_x)+parseInt(legend_objects[objecti].legend_rectSize)+self.LEGENDsettings.GapBetweenGraphicText
                textY=parseInt(legend_objects[objecti].legend_y)+parseInt(legend_objects[objecti].legend_rectSize)/2
                svg.append("text")
                 .attr("x", textX)
                 .attr("y", textY)
                 .style("font-size", legend_objects[objecti].legend_textSize)
                 .style("font-weight", legend_objects[objecti].legend_textWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
                 .attr("fill", "black")
                 .text(legend_objects[objecti].legend_text);

              }
          }
                                

          
        self.init_LEGENDsettings();
      }


    }

    //legend

    if(self.CNV.length > 0){
        //console.log(self.CNV);
            function NGCircosCNV(d) {
              return self.CNV[cnvi].map(function(v, i) {
                //console.log(v,i)
                var cnv_k = (d[self.initGenome[v.chr]].endAngle - d[self.initGenome[v.chr]].startAngle) / d[self.initGenome[v.chr]].value;
                return {
                  startAngle: v.start * cnv_k + d[self.initGenome[v.chr]].startAngle,
                  endAngle: v.end * cnv_k + d[self.initGenome[v.chr]].startAngle,
                  cnv_chr: v.chr,
                  cnv_start: v.start,
                  cnv_end: v.end,
                  cnv_val: v.value,
                  cnv_ancestry: v.ancestry,
                  cnv_sex: v.sex,
                  cnv_link: v.link,
                  cnv_color:v.color,
                  cnv_click_label: "cnv"+cnvi+"_"+i,
                  cnv_deviation: (v.value-self.cnv_value_maxmin(self.CNV[cnvi])[1])/(self.cnv_value_maxmin(self.CNV[cnvi])[0]-self.cnv_value_maxmin(self.CNV[cnvi])[1])*(self.CNVsettings.maxRadius-self.CNVsettings.minRadius),
                  cnv_html : v.html,
                };
              });
            }
            function NGCircosCNV2(d) {
              return self.CNV[cnvi].map(function(v, i) {
                var cnv_k = (d[self.initGenome[v.chr]].endAngle - d[self.initGenome[v.chr]].startAngle) / d[self.initGenome[v.chr]].value;
                return {
                  startAngle: 3*Math.PI-(v.start * cnv_k + d[self.initGenome[v.chr]].startAngle),
                  endAngle: 3*Math.PI-(v.end * cnv_k + d[self.initGenome[v.chr]].startAngle),
                  cnv_chr: v.chr,
                  cnv_start: v.start,
                  cnv_end: v.end,
                  cnv_val: v.value,
                  cnv_ancestry: v.ancestry,
                  cnv_sex: v.sex,
                  cnv_link: v.link,
                  cnv_color:v.color,
                  cnv_click_label: "cnv"+cnvi+"_"+i,
                  cnv_deviation: (v.value-self.cnv_value_maxmin(self.CNV[cnvi])[1])/(self.cnv_value_maxmin(self.CNV[cnvi])[0]-self.cnv_value_maxmin(self.CNV[cnvi])[1])*(self.CNVsettings.maxRadius-self.CNVsettings.minRadius),
                  cnv_html:v.html,
                };
              });
            }
        for(var cnvi=0; cnvi<self.CNV.length; cnvi++){
            self.update_CNVsettings(self.CNVConfig[cnvi]);
            if(drawTime == self.CNVsettings.compareGroup){
               if(self.CNVsettings.compareGroup == 1){
                  var cnv_objects = NGCircosCNV(chord.groups())
                }else{
                  var cnv_objects = NGCircosCNV2(chord.groups())
                }
            
            if(self.CNVsettings.CNVAnimationDisplay == true){
              svg.append("g")
                  .attr("class", "NGCircosCNV")
                  .selectAll("path.NGCircosCNV")
                    .data(cnv_objects)
                    .enter()
                  .append("a")
                  .attr("xlink:href", function(d){if(self.settings.CNVxlink == true){return d.cnv_link;}})
                  .append("path")
                  .attr("class", "NGCircosCNV")
                  .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")")
                  .attr("fill", "none")
                  .attr("stroke","none")
                  .attr("stroke-width","none")
                  .attr("opacity","none")
                  .attr("d", function(d,i) { var cnv = d3.svg.arc().innerRadius(self.CNVsettings.minRadius).outerRadius(self.CNVsettings.maxRadius); return cnv(d,i); })
                  .transition()
                  .delay(function(d,i){
                    return (i+1) * self.CNVsettings.CNVAnimationDelay;
                  })
                  .duration(self.CNVsettings.CNVAnimationTime)
                  .ease(self.CNVsettings.CNVAnimationType)
                  .attr("fill", function(d,i) { if(d.cnv_color != undefined){return d.cnv_color;}else{return self.CNVsettings.CNVColor;} })
                  .attr("stroke",self.CNVsettings.strokeColor)
                  .attr("stroke-width",self.CNVsettings.strokeWidth)
                  .attr("opacity",self.CNVsettings.opacity)
                  .attr("d", function(d,i) { var cnv = d3.svg.arc().innerRadius(self.CNVsettings.minRadius+d.cnv_deviation).outerRadius(self.CNVsettings.minRadius+self.CNVsettings.CNVwidth+d.cnv_deviation); return cnv(d,i); });
            }else{
              svg.append("g")
                  .attr("class", "NGCircosCNV")
                  .selectAll("path.NGCircosCNV")
                    .data(cnv_objects)
                    .enter()
                  .append("a")
                  .attr("xlink:href", function(d){if(self.settings.CNVxlink == true){return d.cnv_link;}})
                  .append("path")
                  .attr("class", "NGCircosCNV")
                  .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")")
                  .attr("fill", function(d,i) { if(d.cnv_color != undefined){return d.cnv_color;}else{return self.CNVsettings.CNVColor;} })
                  .attr("stroke",self.CNVsettings.strokeColor)
                  .attr("stroke-width",self.CNVsettings.strokeWidth)
                  .attr("opacity",self.CNVsettings.opacity)
                  .attr("d", function(d,i) { var cnv = d3.svg.arc().innerRadius(self.CNVsettings.minRadius+d.cnv_deviation).outerRadius(self.CNVsettings.minRadius+self.CNVsettings.CNVwidth+d.cnv_deviation); return cnv(d,i); });
            }

                  if(self.settings.CNVMouseClickTextFromData=="first"){
                      svg.append("g")
                          .attr("class", "NGCircosCNVlabel")
                        .selectAll("text")
                          .data(cnv_objects)
                          .enter().append("text")
                          .attr("class", "dragText")
                          .attr("id", function(d,i) { return "cnv"+cnvi+"_"+i; })
                          .text(function(d) { return d.cnv_chr; })
                          .attr("x", 0)
                          .attr("y", 0)
                          .style("opacity", 0)
                          .style("font-size", 1)
                          .attr("fill", self.CNVsettings.CNVFillColor)
                          .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")");
                  }
                  if(self.settings.CNVMouseClickTextFromData=="second"){
                      svg.append("g")
                          .attr("class", "NGCircosCNVlabel")
                        .selectAll("text")
                          .data(cnv_objects)
                          .enter().append("text")
                          .attr("class", "dragText")
                          .attr("id", function(d,i) { return "cnv"+cnvi+"_"+i; })
                          .text(function(d) { return d.cnv_start; })
                          .attr("x", 0)
                          .attr("y", 0)
                          .style("opacity", 0)
                          .style("font-size", 1)
                          .attr("fill", self.CNVsettings.CNVFillColor)
                          .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")");
                  }
                  if(self.settings.CNVMouseClickTextFromData=="third"){
                      svg.append("g")
                          .attr("class", "NGCircosCNVlabel")
                        .selectAll("text")
                          .data(cnv_objects)
                          .enter().append("text")
                          .attr("class", "dragText")
                          .attr("id", function(d,i) { return "cnv"+cnvi+"_"+i; })
                          .text(function(d) { return d.cnv_end; })
                          .attr("x", 0)
                          .attr("y", 0)
                          .style("opacity", 0)
                          .style("font-size", 1)
                          .attr("fill", self.CNVsettings.CNVFillColor)
                          .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")");
                  }
                  if(self.settings.CNVMouseClickTextFromData=="fourth"){
                      svg.append("g")
                          .attr("class", "NGCircosCNVlabel")
                        .selectAll("text")
                          .data(cnv_objects)
                          .enter().append("text")
                          .attr("class", "dragText")
                          .attr("id", function(d,i) { return "cnv"+cnvi+"_"+i; })
                          .text(function(d) { return d.cnv_val; })
                          .attr("x", 0)
                          .attr("y", 0)
                          .style("opacity", 0)
                          .style("font-size", 1)
                          .attr("fill", self.CNVsettings.CNVFillColor)
                          .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")");
                  }

            }
            
            self.init_CNVsettings();

        }
          
        if(self.settings.CNVMouseEvent==true){
            var CNVMouseOnTooltip = d3.select("body")
                .append("div")
                .attr("class","NGCircosCNVTooltip")
                .attr("id","NGCircosCNVTooltip")
                .style("opacity",0);

            var CNVMouseOn = svg.selectAll("path.NGCircosCNV");
            
//            if(self.settings.CNVMouseCombinationEvent == true){
//              if(self.settings.CNVMouseOverDisplay==true){
//                function CNVCombinationMouseOver(d, i) {
//                  var CNVCombinationData=[d.cnv_val,2,3]
//      //              console.log(CNVCombinationData)
//      //              console.log(d3.max(CNVCombinationData))
//                    
//                  var padding = {left:30, right:60, top:20, bottom:40};
//                  //x轴的比例尺
//                  var xScale = d3.scale.ordinal()
//                    .domain(d3.range(CNVCombinationData.length))
//                    .rangeRoundBands([0, width/4- padding.left - padding.right]);
//                  //y轴的比例尺
//                  var yScale = d3.scale.linear()
//                    .domain([0,d3.max(CNVCombinationData)])
//                    .range([height/2 - padding.top - padding.bottom, 0]);
//                    
//                  //定义x轴
//                  var xAxis = d3.svg.axis()
//                    .scale(xScale)
//                    .orient("bottom");
//                  //定义y轴
//                  var yAxis = d3.svg.axis()
//                    .scale(yScale)
//                    .orient("left");
//                  //矩形之间的空白
//                  var rectPadding = 40;
//                  var combinationStartX=width/4+padding.left
//                  //添加矩形元素
//                  var rects = svg.append("g")
//                      .attr("class", "CNVCombinationRect")
//                      .selectAll(".CNVCombinationRect")
//                      .data(CNVCombinationData)
//                      .enter()
//                      .append("rect")
//                      .attr("class","CNVCombinationRect")
//                      .attr("transform","translate(" + combinationStartX + "," + (height/2+padding.top) + ")")
//                      .attr("fill","#4782B4")
//                      .attr({
//                      id: "CNVCombinationRect-" + i,
//                      x: function(d,i){
//                        return xScale(i) + rectPadding/2;
//                      } })
//                      .attr("y",function(d){
//                        return yScale(d)-height/2;
//                      })
//                      .attr("width", xScale.rangeBand() - rectPadding )
//                      .attr("height", function(d){
//                        //console.log(yScale(d))
//                        return height/2 - padding.top - padding.bottom - yScale(d);
//                      });
//
//                  //添加文字元素
//                  var texts = svg.selectAll(".CNVCombinationText")
//                      .data(CNVCombinationData)
//                      .enter()
//                      .append("text")
//                      .attr("class","CNVCombinationText")
//                      .attr("transform","translate(" +combinationStartX+ "," + (height/2+padding.top) + ")")
//                      .attr("fill","white")
//                      .attr({
//                        id: "CNVCombinationText-" + i,
//                        x: function(d,i){
//                                          return xScale(i) + rectPadding/2;
//                                        }
//                      } )
//                      .attr("y",function(d){
//                        return yScale(d)-height/2;
//                      })
//                      .attr("dx",function(){
//                        return (xScale.rangeBand() - rectPadding)/2;
//                      })
//                      .attr("dy",function(d){
//                        return 20;
//                      })
//                      .text(function(d){
//                        return d;
//                      });
//                  //添加x轴
//                  svg.append("g")
//                    .attr("class","CNVCombinationAxis")
//                    .attr("transform","translate(" + (combinationStartX-6) + "," + (height - padding.bottom-height/2) + ")")
//                    .attr({id:"CNVCombinationAxisX"})
//                    .attr("fill","black")
//                    .call(xAxis); 
//
//                  //添加y轴
//                  svg.append("g")
//                    .attr("class","CNVCombinationAxis")
//                    .attr("transform","translate(" + combinationStartX + "," + (padding.top) + ")")
//                    .attr("id","CNVCombinationAxisY")
//                    .attr("fill","black")
//                    .call(yAxis);
//                  
//                   CNVMouseOnTooltip.html(self.settings.CNVMouseOverTooltipsHtml01+d.cnv_chr+self.settings.CNVMouseOverTooltipsHtml02+d.cnv_start+self.settings.CNVMouseOverTooltipsHtml03+d.cnv_end+self.settings.CNVMouseOverTooltipsHtml04+d.cnv_val+self.settings.CNVMouseOverTooltipsHtml05)
//                   .style("left", (d3.event.pageX) + "px")
//                   .style("top", (d3.event.pageY + 20) + "px")
//                   .style("position", self.settings.CNVMouseOverTooltipsPosition)
//                   .style("background-color", self.settings.CNVMouseOverTooltipsBackgroundColor)
//                   .style("border-style", self.settings.CNVMouseOverTooltipsBorderStyle)
//                   .style("border-width", self.settings.CNVMouseOverTooltipsBorderWidth)
//                   .style("padding", self.settings.CNVMouseOverTooltipsPadding)
//                   .style("border-radius", self.settings.CNVMouseOverTooltipsBorderRadius)
//                   .style("opacity", self.settings.CNVMouseOverTooltipsOpacity)
//                d3.select(this)
//                   .style("fill",  function(d,i) { if(self.settings.CNVMouseOverColor=="none"){return "";}else{return self.settings.CNVMouseOverColor;} })
//                   .style("opacity",  function(d,i) { if(self.settings.CNVMouseOverArcOpacity=="none"){return "";}else{return self.settings.CNVMouseOverArcOpacity;} })
//                   .style("stroke", function(d,i) { if(self.settings.CNVMouseOverArcStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeColor;} })
//                   .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOverArcStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeWidth;} });
//                }
//                
//                CNVMouseOn.on("mouseover",CNVCombinationMouseOver)
//                
//              }else{
//                function CNVCombinationMouseOver(d, i) {
//                  var CNVCombinationData=[d.cnv_val,2,3]
//      //              console.log(CNVCombinationData)
//      //              console.log(d3.max(CNVCombinationData))
//                    
//                  var padding = {left:30, right:60, top:20, bottom:40};
//                  //x轴的比例尺
//                  var xScale = d3.scale.ordinal()
//                    .domain(d3.range(CNVCombinationData.length))
//                    .rangeRoundBands([0, width/4- padding.left - padding.right]);
//                  //y轴的比例尺
//                  var yScale = d3.scale.linear()
//                    .domain([0,d3.max(CNVCombinationData)])
//                    .range([height/2 - padding.top - padding.bottom, 0]);
//                    
//                  //定义x轴
//                  var xAxis = d3.svg.axis()
//                    .scale(xScale)
//                    .orient("bottom");
//                  //定义y轴
//                  var yAxis = d3.svg.axis()
//                    .scale(yScale)
//                    .orient("left");
//                  //矩形之间的空白
//                  var rectPadding = 40;
//                  var combinationStartX=width/4+padding.left
//                  //添加矩形元素
//                  var rects = svg.append("g")
//                      .attr("class", "CNVCombinationRect")
//                      .selectAll(".CNVCombinationRect")
//                      .data(CNVCombinationData)
//                      .enter()
//                      .append("rect")
//                      .attr("class","CNVCombinationRect")
//                      .attr("transform","translate(" + combinationStartX + "," + (height/2+padding.top) + ")")
//                      .attr("fill","#4782B4")
//                      .attr({
//                      id: "CNVCombinationRect-" + i,
//                      x: function(d,i){
//                        return xScale(i) + rectPadding/2;
//                      } })
//                      .attr("y",function(d){
//                        return yScale(d)-height/2;
//                      })
//                      .attr("width", xScale.rangeBand() - rectPadding )
//                      .attr("height", function(d){
//                        //console.log(yScale(d))
//                        return height/2 - padding.top - padding.bottom - yScale(d);
//                      });
//
//                  //添加文字元素
//                  var texts = svg.selectAll(".CNVCombinationText")
//                      .data(CNVCombinationData)
//                      .enter()
//                      .append("text")
//                      .attr("class","CNVCombinationText")
//                      .attr("transform","translate(" +combinationStartX+ "," + (height/2+padding.top) + ")")
//                      .attr("fill","white")
//                      .attr({
//                        id: "CNVCombinationText-" + i,
//                        x: function(d,i){
//                                          return xScale(i) + rectPadding/2;
//                                        }
//                      } )
//                      .attr("y",function(d){
//                        return yScale(d)-height/2;
//                      })
//                      .attr("dx",function(){
//                        return (xScale.rangeBand() - rectPadding)/2;
//                      })
//                      .attr("dy",function(d){
//                        return 20;
//                      })
//                      .text(function(d){
//                        return d;
//                      });
//                  //添加x轴
//                  svg.append("g")
//                    .attr("class","CNVCombinationAxis")
//                    .attr("transform","translate(" + (combinationStartX-6) + "," + (height - padding.bottom-height/2) + ")")
//                    .attr({id:"CNVCombinationAxisX"})
//                    .attr("fill","black")
//                    .call(xAxis); 
//
//                  //添加y轴
//                  svg.append("g")
//                    .attr("class","CNVCombinationAxis")
//                    .attr("transform","translate(" + combinationStartX + "," + (padding.top) + ")")
//                    .attr("id","CNVCombinationAxisY")
//                    .attr("fill","black")
//                    .call(yAxis);
//                  
//                }
//                
//                CNVMouseOn.on("mouseover",CNVCombinationMouseOver)
//                
//              }
//              
//              if(self.settings.CNVMouseOutDisplay==true){
//                function CNVCombinationMouseOut(d, i) {
//                            // Select by id and then remove
//                            d3.selectAll("#" + "CNVCombinationRect-" + i).remove();
//                            d3.selectAll("#" + "CNVCombinationText-" + i).remove();
//                            d3.selectAll("#" + "CNVCombinationAxisX" ).remove();
//                            d3.selectAll("#" + "CNVCombinationAxisY").remove();
//                            
//                            CNVMouseOnTooltip.style("opacity",0);
//                            
//                            d3.select(this)
//                              .transition()
//                              .duration(self.settings.CNVMouseOutAnimationTime)
//                              .style("fill",  function(d,i) { if(self.settings.CNVMouseOutColor=="none"){return "";}else{return self.settings.CNVMouseOutColor;} })
//                              .style("opacity",  function(d,i) { if(self.settings.CNVMouseOutCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseOutCircleOpacity;} })
//                              .style("stroke", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeColor;} })
//                              .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeWidth;} });
//
//                          }
//                CNVMouseOn.on("mouseout",CNVCombinationMouseOut)
//              }else {
//                function CNVCombinationMouseOut(d, i) {
//                            // Select by id and then remove
//                            d3.selectAll("#" + "CNVCombinationRect-" + i).remove();
//                            d3.selectAll("#" + "CNVCombinationText-" + i).remove();
//                            d3.selectAll("#" + "CNVCombinationAxisX" ).remove();
//                            d3.selectAll("#" + "CNVCombinationAxisY").remove();
//                            
//                          }
//                CNVMouseOn.on("mouseout",CNVCombinationMouseOut)
//              }
//              
//            }else{                
                if(self.settings.CNVMouseOverDisplay==true){
                    CNVMouseOn.on("mouseover",function(d){
                          if(self.ticksOffset != undefined){
                            CNVMouseOnTooltip.html(function(){if(self.settings.CNVMouseOverTooltipsSetting == "style1"){
                                return "chr : "+d.cnv_chr+"<br>start : "+(parseInt(d.cnv_start)+self.ticksOffset)+"<br>end :"+(parseInt(d.cnv_end)+self.ticksOffset)+" <br>value : "+d.cnv_val+""+" <br>ancestry : "+d.cnv_ancestry+""+" <br>sex : "+d.cnv_sex
                              }else if (self.settings.CNVMouseOverTooltipsSetting == "custom") {
                                return self.settings.CNVMouseOverTooltipsHtml+d.cnv_html
                              }
                            })
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("position", self.settings.CNVMouseOverTooltipsPosition)
                            .style("background-color", self.settings.CNVMouseOverTooltipsBackgroundColor)
                            .style("border-style", self.settings.CNVMouseOverTooltipsBorderStyle)
                            .style("border-width", self.settings.CNVMouseOverTooltipsBorderWidth)
                            .style("padding", self.settings.CNVMouseOverTooltipsPadding)
                            .style("border-radius", self.settings.CNVMouseOverTooltipsBorderRadius)
                            .style("opacity", self.settings.CNVMouseOverTooltipsOpacity)
                          d3.select(this)
                            .style("fill",  function(d,i) { if(self.settings.CNVMouseOverColor=="none"){return "";}else{return self.settings.CNVMouseOverColor;} })
                            .style("opacity",  function(d,i) { if(self.settings.CNVMouseOverArcOpacity=="none"){return "";}else{return self.settings.CNVMouseOverArcOpacity;} })
                            .style("stroke", function(d,i) { if(self.settings.CNVMouseOverArcStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeColor;} })
                            .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOverArcStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeWidth;} });
                          }else{
                            CNVMouseOnTooltip.html(function(){if(self.settings.CNVMouseOverTooltipsSetting == "style1"){
                                return "chr : "+d.cnv_chr+"<br>start : "+d.cnv_start+"<br>end :"+d.cnv_end+" <br>value : "+d.cnv_val+" <br>ancestry : "+d.cnv_ancestry+" <br>sex : "+d.cnv_sex+""
                              }else if (self.settings.CNVMouseOverTooltipsSetting == "custom") {
                                return self.settings.CNVMouseOverTooltipsHtml+d.cnv_html
                              }
                            })
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY + 20) + "px")
                            .style("position", self.settings.CNVMouseOverTooltipsPosition)
                            .style("background-color", self.settings.CNVMouseOverTooltipsBackgroundColor)
                            .style("border-style", self.settings.CNVMouseOverTooltipsBorderStyle)
                            .style("border-width", self.settings.CNVMouseOverTooltipsBorderWidth)
                            .style("padding", self.settings.CNVMouseOverTooltipsPadding)
                            .style("border-radius", self.settings.CNVMouseOverTooltipsBorderRadius)
                            .style("opacity", self.settings.CNVMouseOverTooltipsOpacity)
                          d3.select(this)
                            .style("fill",  function(d,i) { if(self.settings.CNVMouseOverColor=="none"){return "";}else{return self.settings.CNVMouseOverColor;} })
                            .style("opacity",  function(d,i) { if(self.settings.CNVMouseOverArcOpacity=="none"){return "";}else{return self.settings.CNVMouseOverArcOpacity;} })
                            .style("stroke", function(d,i) { if(self.settings.CNVMouseOverArcStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeColor;} })
                            .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOverArcStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeWidth;} });
                          }
                          
                        

                    })
                }
                if(self.settings.CNVMouseOutDisplay==true){
                      CNVMouseOn.on("mouseout",function(d){
                          CNVMouseOnTooltip.style("opacity",0.0);
                          d3.select(this)
                              .transition()
                              .duration(self.settings.CNVMouseOutAnimationTime)
                              .style("fill",  function(d,i) { if(self.settings.CNVMouseOutColor=="none"){return "";}else{return self.settings.CNVMouseOutColor;} })
                              .style("opacity",  function(d,i) { if(self.settings.CNVMouseOutCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseOutCircleOpacity;} })
                              .style("stroke", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeColor;} })
                              .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeWidth;} });
                      });
                }
              
//            }
            
//            if(self.settings.CNVMouseOverDisplay==true){
//                CNVMouseOn.on("mouseover",function(d){
//                      CNVMouseOnTooltip.html(self.settings.CNVMouseOverTooltipsHtml01+d.cnv_chr+self.settings.CNVMouseOverTooltipsHtml02+d.cnv_start+self.settings.CNVMouseOverTooltipsHtml03+d.cnv_end+self.settings.CNVMouseOverTooltipsHtml04+d.cnv_val+self.settings.CNVMouseOverTooltipsHtml05)
//                       .style("left", (d3.event.pageX) + "px")
//                       .style("top", (d3.event.pageY + 20) + "px")
//                       .style("position", self.settings.CNVMouseOverTooltipsPosition)
//                       .style("background-color", self.settings.CNVMouseOverTooltipsBackgroundColor)
//                       .style("border-style", self.settings.CNVMouseOverTooltipsBorderStyle)
//                       .style("border-width", self.settings.CNVMouseOverTooltipsBorderWidth)
//                       .style("padding", self.settings.CNVMouseOverTooltipsPadding)
//                       .style("border-radius", self.settings.CNVMouseOverTooltipsBorderRadius)
//                       .style("opacity", self.settings.CNVMouseOverTooltipsOpacity)
//                    d3.select(this)
//                       .style("fill",  function(d,i) { if(self.settings.CNVMouseOverColor=="none"){return "";}else{return self.settings.CNVMouseOverColor;} })
//                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseOverArcOpacity=="none"){return "";}else{return self.settings.CNVMouseOverArcOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.CNVMouseOverArcStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOverArcStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOverArcStrokeWidth;} });
//                    
//
//                })
//            }

            if(self.settings.CNVMouseClickDisplay==true){
                CNVMouseOn.on("click",function(d){
                    d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseClickColor=="none"){return "";}else{return self.settings.CNVMouseClickColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseClickArcOpacity=="none"){return "";}else{return self.settings.CNVMouseClickArcOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseClickArcStrokeColor=="none"){return "";}else{return self.settings.CNVMouseClickArcStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseClickArcStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseClickArcStrokeWidth;} });
                    d3.select("#"+d.cnv_click_label)
                        .style("opacity", self.settings.CNVMouseClickTextOpacity)
                        .style("fill", self.settings.CNVMouseClickTextColor)
                        .style("font-size", self.settings.CNVMouseClickTextSize)
                        .attr("x", d3.event.x - self.svgWidth/2 + self.settings.ARCMouseClickTextPostionX)
                        .attr("y", d3.event.y - self.svgHeight/2 + self.settings.ARCMouseClickTextPostionY);
                })
            }

            if(self.settings.CNVMouseClickTextDrag==true){
                svg.selectAll("text.dragText").call(drag);
            }
            if(self.settings.CNVMouseDownDisplay==true){
               CNVMouseOn.on("mousedown",function(d){
                   d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseDownColor=="none"){return "";}else{return self.settings.CNVMouseDownColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseDownCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseDownCircleOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseDownCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseDownCircleStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseDownCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseDownCircleStrokeWidth;} });
               })
            }
            if(self.settings.CNVMouseEnterDisplay==true){
               CNVMouseOn.on("mouseenter",function(d){
                   d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseEnterColor=="none"){return "";}else{return self.settings.CNVMouseEnterColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseEnterCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseEnterCircleOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseEnterCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseEnterCircleStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseEnterCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseEnterCircleStrokeWidth;} });
               })
            }
            if(self.settings.CNVMouseLeaveDisplay==true){
               CNVMouseOn.on("mouseleave",function(d){
                   CNVMouseOnTooltip.style("opacity",0.0);
                   d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseLeaveColor=="none"){return "";}else{return self.settings.CNVMouseLeaveColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseLeaveCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseLeaveCircleOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseLeaveCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseLeaveCircleStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseLeaveCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseLeaveCircleStrokeWidth;} });
               })
            }
            if(self.settings.CNVMouseUpDisplay==true){
               CNVMouseOn.on("mouseup",function(d){
                   d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseUpColor=="none"){return "";}else{return self.settings.CNVMouseUpColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseUpCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseUpCircleOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseUpCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseUpCircleStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseUpCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseUpCircleStrokeWidth;} });
               })
            }
            if(self.settings.CNVMouseMoveDisplay==true){
               CNVMouseOn.on("mousemove",function(d){
                   d3.select(this)
                       .style("fill",  function(d,i) { if(self.settings.CNVMouseMoveColor=="none"){return "";}else{return self.settings.CNVMouseMoveColor;} })
                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseMoveCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseMoveCircleOpacity;} })
                       .style("stroke", function(d,i) { if(self.settings.CNVMouseMoveCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseMoveCircleStrokeColor;} })
                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseMoveCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseMoveCircleStrokeWidth;} });
                   CNVMouseOnTooltip.style("left", (d3.event.pageX) + "px")
                   .style("top", (d3.event.pageY + 20) + "px");
               })
            }
//            if(self.settings.CNVMouseOutDisplay==true){
//               CNVMouseOn.on("mouseout",function(d){
//                   CNVMouseOnTooltip.style("opacity",0.0);
//                   d3.select(this)
//                       .transition()
//                       .duration(self.settings.CNVMouseOutAnimationTime)
//                       .style("fill",  function(d,i) { if(self.settings.CNVMouseOutColor=="none"){return "";}else{return self.settings.CNVMouseOutColor;} })
//                       .style("opacity",  function(d,i) { if(self.settings.CNVMouseOutCircleOpacity=="none"){return "";}else{return self.settings.CNVMouseOutCircleOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeColor=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.CNVMouseOutCircleStrokeWidth=="none"){return "";}else{return self.settings.CNVMouseOutCircleStrokeWidth;} });
//               });
//            }
        }

    }
 
    //LABEL
//     if(self.LABEL.length > 0){
//           labelArray=[];
//           anchorArray=[];
//           tempArc=d3.svg.arc()  // 创建弧形。
//             .innerRadius((innerRadius+outerRadius)/2)  // 内径
//             .outerRadius((innerRadius+outerRadius)/2)

//           function NGCircosLABEL(d) {
//               return self.LABEL[labeli].map(function(v, i) {
//                 var label_k = (d[self.initGenome[v.chr]].endAngle - d[self.initGenome[v.chr]].startAngle) / d[self.initGenome[v.chr]].value;
//                 return {
//                   label_angle: v.pos * label_k + d[self.initGenome[v.chr]].startAngle,
//                   label_val: v.value,
//                   x: tempArc.centroid({startAngle:v.pos * label_k + d[self.initGenome[v.chr]].startAngle,endAngle:v.pos * label_k + d[self.initGenome[v.chr]].startAngle})[0],  //self.snp_value_maxmin(self.SNP[snpi])[0] max
//                   y: tempArc.centroid({startAngle:v.pos * label_k + d[self.initGenome[v.chr]].startAngle,endAngle:v.pos * label_k + d[self.initGenome[v.chr]].startAngle})[1],
//                 };
//               });
//             }
//             function NGCircosLABEL2(d) {
//                 return self.LABEL[labeli].map(function(v, i) {
//                   var label_k = (d[self.initGenome[v.chr]].endAngle - d[self.initGenome[v.chr]].startAngle) / d[self.initGenome[v.chr]].value;
//                   return {
//                     label_angle: 3*Math.PI-(v.pos * label_k + d[self.initGenome[v.chr]].startAngle),
//                     label_val: v.value,
//                     x: tempArc.centroid({startAngle:3*Math.PI-(v.pos * label_k + d[self.initGenome[v.chr]].startAngle),endAngle:3*Math.PI-(v.pos * label_k + d[self.initGenome[v.chr]].startAngle)})[0],  //self.snp_value_maxmin(self.SNP[snpi])[0] max
//                     y: tempArc.centroid({startAngle:3*Math.PI-(v.pos * label_k + d[self.initGenome[v.chr]].startAngle),endAngle:3*Math.PI-(v.pos * label_k + d[self.initGenome[v.chr]].startAngle)})[1],
//                   };
//                 });
//               }
//         function redrawLabels(){
//                 labels
//                   .transition()
//                   .duration(1500)
//                   .attr("x",(d) => d.x)
//                   .attr("y",(d) => d.y);
//                 links
//                 .transition()
//                 .duration(1500)
//                 .attr("x2",(d) => d.x)
//                 .attr("y2",(d) => d.y);
//         }
        
//         for(var labeli=0; labeli<self.LABEL.length; labeli++){
//             self.update_LABELsettings(self.LABELConfig[labeli]);
//             if(drawTime == self.LABELsettings.compareGroup){
//               //console.log(chord.groups())
//                if(self.LABELsettings.compareGroup == 1){
//                 var label_objects = NGCircosLABEL(chord.groups())
//               }else{
//                 var label_objects = NGCircosLABEL2(chord.groups())
//               }
              
//               for(var objecti=0; objecti<label_objects.length;objecti++){
//                 labelArray.push({x: label_objects[objecti].x, y: label_objects[objecti].y, name: label_objects[objecti].label_val, width: 0.0, height: 0.0});
//                 anchorArray.push({x: label_objects[objecti].x, y: label_objects[objecti].y , r: outerRadius-innerRadius});
//               }
//             }                              
//             self.init_LABELsettings();

//         }
        
//         d3.labeler = function () {
//           var labeler = {}, w, h, lab = [], anc = [];

//           var max_move = 5.0,
//             max_angle = 0.5,
//             acc = 0,
//             rej = 0;

//           //weight
//           var weight_label = 30.0,
//             weight_label_anc = 30.0,
//             weight_len = 0.2;

//           energy = function (index) {
//             var m = lab.length,
//               ener = 0,
//               dx = lab[index].x - anc[index].x, //x dist between point and label
//               dy = anc[index].y - lab[index].y, //y dist between point and label
//               dist = Math.sqrt(dx * dx + dy * dy);

//             // penalty for length of leader line
//             if (dist > 0) ener += dist * weight_len;

//             var x21 = lab[index].x,
//               y21 = lab[index].y - lab[index].height + 2.0,
//               x22 = lab[index].x + lab[index].width,
//               y22 = lab[index].y + 2.0;
//             var x11, x12, y11, y12, x_overlap, y_overlap, overlap_area;
//             for (var i = 0; i < m; i++) {
//               if (i != index) {
//                 //label-label overlap
//                 //positions of 4 corners of rect bounding the text
//                 x11 = lab[i].x,
//                 y11 = lab[i].y - lab[i].height + 2.0,
//                 x12 = lab[i].x + lab[i].width,
//                 y12 = lab[i].y + 2.0;
//                 x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
//                 y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
//                 overlap_area = x_overlap * y_overlap;
//                 ener += (overlap_area * weight_label);
//               }
//               //label point overlap
//               x11 = anc[i].x - anc[i].r; //x start point
//               y11 = anc[i].y - anc[i].r; //y start point
//               x12 = anc[i].x + anc[i].r; //x end point
//               y12 = anc[i].y + anc[i].r; //y end point
//               x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
//               y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
//               overlap_area = x_overlap * y_overlap;
//               ener += (overlap_area * weight_label_anc);
//             }
//             return ener;
//           };
        
//           mcmove = function (currTemp) {
//             var i = Math.floor(Math.random() * lab.length);

//             //save old location of label
// //            var x_old = lab[i].x+Math.tan(label_objects[i].label_angle)*((Math.random() - 0.5) * max_move);
//             var x_old = lab[i].x
//             var y_old = lab[i].y;

//             //old energy
//             var old_energy = energy(i);

//             //move to a new position
            
// //            lab[i].x += (Math.random() - 0.5) * max_move+Math.tan(label_objects[i].label_angle)*((Math.random() - 0.5) * max_move)
//             lab[i].x += (Math.random() - 0.5) * max_move
//             lab[i].y += (Math.random() - 0.5) * max_move
            
//             if (lab[i].x > w) { lab[i].x = x_old; }
//             if (lab[i].x < 0) { lab[i].x = x_old; }
//             if (lab[i].y > h) { lab[i].y = y_old; }
//             if (lab[i].y < 0) { lab[i].y = y_old; }

//             //new energy
//             var new_energy = energy(i);
//             //change in energy
//             var delta_energy = new_energy - old_energy;

//             if (Math.random() < Math.exp(-delta_energy / currTemp)) {
//               // acc += 1;
//               // do nothing, label already at new pos
//             } else {
//               //go back to the old pos
//               lab[i].x = x_old;
//               lab[i].y = y_old;
//               rej += 1;
//             }
//           }

//           coolingTemp = function (currTemp, initialTemp, nsweeps) {
//             return (currTemp - (initialTemp / nsweeps));
//           }
//           labeler.start = function (nsweeps) {
//             //starts simulated annealing
//             var m = lab.length,
//               currTemp = 1.0,
//               initialTemp = 1.0;
//             for (var i = 0; i < nsweeps; i++) {
//               for (var j = 0; j < m; j++) {
//                 mcmove(currTemp);
//               }
//               currTemp = coolingTemp(currTemp, initialTemp, nsweeps);
//             }
//           };
//           labeler.width = function (x) {
//             w = x;
//             return labeler;
//           };
//           labeler.height = function (x) {
//             h = x;
//             return labeler;
//           };
//           labeler.label = function (x) {
//             lab = x;
//             return labeler;
//           };
//           labeler.anchor = function (x) {
//             anc = x;
//             return labeler;
//           };
//           return labeler;
//         };
        
        
//        // console.log(labelArray)
//         //console.log(anchorArray)
//         labels=svg.append("g")
//             .attr("class", "NGCircosLABEL")
//           .selectAll(".label")
//             .data(labelArray)
//             .enter()
//             .append("text")
//             .attr("id", "NGCircosLABEL")
//             .attr("x", (d,i) => {
//                         return d.x;
//                       })
//             .attr("y", (d,i) => {
//                         return d.y;
//                       })
//             .attr('text-anchor','start')
//             .style("opacity", self.LABELsettings.LABELOpacity)
//             .style("font-size", self.LABELsettings.LABELSize)
//             .style("font-weight", self.LABELsettings.LABELWeight) //normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900
//             .attr("fill", self.LABELsettings.LABELColor)
//             .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")")
//             .text((d) => d.name);

        
//         var index = 0;
//         labels.each(function() {
//             labelArray[index].width = this.getBBox().width;
//             labelArray[index].height = this.getBBox().height;
//             index += 1;
//         });
        
//         links = svg.selectAll(".link")
//                   .data(labelArray)
//                   .enter()
//                   .append("line")
//                   .attr("class", "link")
//                   .attr("x1", (d) => d.x)
//                   .attr("y1", (d) => d.y)
//                   .attr("x2", (d) => d.x)
//                   .attr("y2", (d) => d.y)
//                   .attr("stroke-width", 0.2)
//                   .attr("stroke", "#6f6f6f")
//                   .attr("transform", "translate(" + compareMoveDistance + "," + 0 + ")");
            
//         d3.labeler()
//                   .label(labelArray)
//                   .anchor(anchorArray)
//                   .width(self.settings.svgWidth)
//                   .height(self.settings.svgHeight)
//                   .start(2000);
//         redrawLabels();
//     }

    //LABEL


 
    //chord
    
    //COMPARE
//    if(self.COMPARE.length > 0){
//
//        for(var comparei=0; comparei<self.COMPARE.length; comparei++){
//            self.update_COMPAREsettings(self.COMPAREConfig[comparei]);
//
//            var compare_objects = new Array()
////          console.log(self.COMPARE[comparei][1])
//          
//            var total = 0
//            var total2 = 0
//            var mean=0
//            for(var objecti=0; objecti<self.COMPARE[comparei][1].length;objecti++){
//              total += self.COMPARE[comparei][1][objecti]
//            }
//            for(var objectj=0; objectj<self.COMPARE[comparei][3].length;objectj++){
//              total2 += self.COMPARE[comparei][3][objectj]
//            }
//            if (total < total2){
//              mean =total2/self.COMPARE[comparei][3].length
//            }else{
//              mean =total/self.COMPARE[comparei][1].length
//            }
////            console.log(mean)
//            for(var objecti=0; objecti<self.COMPARE[comparei][1].length+self.COMPARE[comparei][3].length+2;objecti++){
//              var array = new Array()
//              for(var objectj=0; objectj<self.COMPARE[comparei][1].length+self.COMPARE[comparei][3].length+2;objectj++){
//                if (objecti < self.COMPARE[comparei][1].length){
//                  if (objectj<= self.COMPARE[comparei][1].length || objectj == self.COMPARE[comparei][1].length+self.COMPARE[comparei][3].length+1){
//                    array.push(0)
//                  }else {
//                    array.push(self.COMPARE[comparei][1][objecti]/self.COMPARE[comparei][3].length)
//                  }
//                }else if (objecti == self.COMPARE[comparei][1].length){
//                  if (objectj == self.COMPARE[comparei][1].length+self.COMPARE[comparei][3].length+1){
//                    array.push(mean)
//                  }else{
//                    array.push(0)
//                  }
//                }else if (objecti <self.COMPARE[comparei][1].length+self.COMPARE[comparei][3].length+1){
//                  if (objectj >= self.COMPARE[comparei][1].length ){
//                    array.push(0)
//                  }else {
//                    array.push(self.COMPARE[comparei][3][objecti-self.COMPARE[comparei][1].length-1]/self.COMPARE[comparei][1].length)
//                  }
//                }else{
//                  if (objectj == self.COMPARE[comparei][1].length){
//                    array.push(mean)
//                  }else{
//                    array.push(0)
//                  }
//                }
//              }
////              console.log(array)
//              compare_objects.push(array)
//              
//            }
////            console.log(compare_objects)
//            var compare_layout = d3.layout.chord()
//            			                 .padding(0.03)
//            			                 .sortSubgroups(d3.descending)
//            			                 .matrix(compare_objects);
//            
//            var color20 = d3.scale.category20();
//
//            if(self.COMPAREsettings.COMPAREouterARC == true){
//              var outer_arc =  d3.svg.arc()
//          					 .innerRadius(self.COMPAREsettings.COMPAREinnerRadius)
//          					 .outerRadius(self.COMPAREsettings.COMPAREouterRadius)
////                     .startAngle(Math.PI*mean/(total+total2+2*mean))
////                     .endAngle(2*Math.PI+Math.PI*mean/(total+total2+2*mean));
//          		
//          		var g_outer = svg.append("g")
//              if(self.COMPAREsettings.COMPAREAutoFillColor == true){
//                g_outer.selectAll("path")
//                				.data(compare_layout.groups)
//                				.enter()
//                				.append("path")
//                		.style("fill", function(d) { 
//                                      if(d.index == self.COMPARE[comparei][1].length || d.index == self.COMPARE[comparei][1].length + self.COMPARE[comparei][1].length+1 ){
//                                        return "white";
//                                      }else{
//                                        return color20(d.index); 
//                                      }
//                                  })
//                		.style("stroke", function(d) { 
//                                      if(d.index == self.COMPARE[comparei][1].length || d.index == self.COMPARE[comparei][1].length + self.COMPARE[comparei][1].length+1){
//                                        return "white";
//                                      }else{
//                                        return color20(d.index); 
//                                      }
//                                  })
//                		.attr("d", outer_arc )
//                    .attr("transform", function(d){
//                      return "rotate(" + 180*mean/(total+total2+2*mean) + ")";
//                     });
//                
//
//              }else{
//                g_outer.selectAll("path")
//                				.data(compare_layout.groups)
//                				.enter()
//                				.append("path")
//                				.style("fill", function (d) {
//                                          if(d.index == self.COMPARE[comparei][1].length || d.index == self.COMPARE[comparei][1].length + self.COMPARE[comparei][1].length+1 ){
//                                            return "white";
//                                          }else{
//                                            return self.COMPAREsettings.COMPAREFillColor
//                                          }
//                                })
//                				.style("stroke", function (d) {
//                                          if(d.index == self.COMPARE[comparei][1].length || d.index == self.COMPARE[comparei][1].length + self.COMPARE[comparei][1].length+1 ){
//                                            return "white";
//                                          }else{
//                                            return self.COMPAREsettings.COMPAREFillColor
//                                          }
//                                })
//                				.attr("d", outer_arc )
//                        .attr("transform", function(d){
//                          return "rotate(" + 180*mean/(total+total2+2*mean) + ")";
//                          });
//
//              }
//              
//              if(self.COMPAREsettings.COMPAREouterARCText == true){
//                g_outer.selectAll("text")
//                				.data(compare_layout.groups)
//                				.enter()
//                				.append("text")
//                				.each( function(d,i) { 
//                					d.angle = (d.startAngle + d.endAngle) / 2; 
//                          if(i>=0 && i<self.COMPARE[comparei][0].length ){
//                            d.name = self.COMPARE[comparei][0][i];
//                          }
//                					if(i>=self.COMPARE[comparei][0].length && i<self.COMPARE[comparei][0].length+self.COMPARE[comparei][2].length+1 ){
//                            d.name = self.COMPARE[comparei][2][i-self.COMPARE[comparei][0].length-1];
//                          }
//                				})
//                				.attr("dy",".35em")
//                				.attr("transform", function(d){
//                					return "rotate(" + ( d.angle * 180 / Math.PI ) + ")" +
//                						   "translate("+180*mean/(total+total2+2*mean)+","+ -1.0*(self.COMPAREsettings.COMPAREouterRadius+10) +")" ;
//                				})
//                				.text(function(d){
//                					return d.name;
//                				});
//
//              }
//          		
//            }
//            
////            var inner_compare =  d3.svg.chord()
////        						.radius(self.COMPAREsettings.COMPAREinnerRadius);
////        		
////            if(self.COMPAREsettings.COMPAREAutoFillColor == true){
////              svg.append("g")
////                    .attr("class", "NGCircosCOMPARE")
////              		    .selectAll("path")
////              			.data(compare_layout.chords)
////              		    .enter()
////              			.append("path")
////                    .attr("class", "NGCircosCOMPARE")
////              			.attr("d", inner_compare )
////              		    .style("fill", function(d) { return color20(d.source.index); })
////              			.style("opacity", self.COMPAREsettings.COMPAREFillOpacity)
////              			.style("stroke",self.COMPAREsettings.COMPAREStrokeColor)
////              			.style("stroke-width",self.COMPAREsettings.COMPAREStrokeWidth);
////
////            }
//        }
//        self.init_COMPAREsettings();
//
//
//        if(self.settings.COMPAREMouseEvent==true){
////            var CHORDMouseOnTooltip = d3.select("body")
////                .append("div")
////                .attr("class","NGCircosCHORDTooltip")
////                .attr("id","NGCircosCHORDTooltip")
////                .style("opacity",0);
//
//            var COMPAREMouseOn = svg.selectAll("path.NGCircosCOMPARE");
//
//            if(self.settings.COMPAREMouseOverDisplay==true){
//                COMPAREMouseOn.on("mouseover",function(d){
////                      COMPAREMouseOnTooltip.html(self.settings.COMPAREMouseOverTooltipsHtml01+self.COMPARE[COMPAREi][0]+self.settings.COMPAREMouseOverTooltipsHtml02)
////                       .style("left", (d3.event.pageX) + "px")
////                       .style("top", (d3.event.pageY + 20) + "px")
////                       .style("position", self.settings.COMPAREMouseOverTooltipsPosition)
////                       .style("background-color", self.settings.COMPAREMouseOverTooltipsBackgroundColor)
////                       .style("border-style", self.settings.COMPAREMouseOverTooltipsBorderStyle)
////                       .style("border-width", self.settings.COMPAREMouseOverTooltipsBorderWidth)
////                       .style("padding", self.settings.COMPAREMouseOverTooltipsPadding)
////                       .style("border-radius", self.settings.COMPAREMouseOverTooltipsBorderRadius)
////                       .style("opacity", self.settings.COMPAREMouseOverTooltipsOpacity)
//                    d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseOverOpacity=="none"){return "";}else{return self.settings.COMPAREMouseOverOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseOverStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseOverStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseOverStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseOverStrokeWidth;} });
//                })
//            }
//            if(self.settings.COMPAREMouseClickDisplay==true){
//                COMPAREMouseOn.on("click",function(d){
//                    d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseClickOpacity=="none"){return "";}else{return self.settings.COMPAREMouseClickOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseClickStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseClickStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseClickStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseClickStrokeWidth;} });
//                })
//            }
//            if(self.settings.COMPAREMouseDownDisplay==true){
//               COMPAREMouseOn.on("mousedown",function(d){
//                   d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseDownOpacity=="none"){return "";}else{return self.settings.COMPAREMouseDownOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseDownStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseDownStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseDownStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseDownStrokeWidth;} });
//               })
//            }
//            if(self.settings.COMPAREMouseEnterDisplay==true){
//               COMPAREMouseOn.on("mouseenter",function(d){
//                   d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseEnterOpacity=="none"){return "";}else{return self.settings.COMPAREMouseEnterOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseEnterStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseEnterStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseEnterStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseEnterStrokeWidth;} });
//               })
//            }
//            if(self.settings.COMPAREMouseLeaveDisplay==true){
//               COMPAREMouseOn.on("mouseleave",function(d){
////                   COMPAREMouseOnTooltip.style("opacity",0.0);
//                   d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseLeaveOpacity=="none"){return "";}else{return self.settings.COMPAREMouseLeaveOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseLeaveStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseLeaveStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseLeaveStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseLeaveStrokeWidth;} });
//               })
//            }
//            if(self.settings.COMPAREMouseUpDisplay==true){
//               COMPAREMouseOn.on("mouseup",function(d){
//                   d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseUpOpacity=="none"){return "";}else{return self.settings.COMPAREMouseUpOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseUpStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseUpStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseUpStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseUpStrokeWidth;} });
//               })
//            }
//            if(self.settings.COMPAREMouseMoveDisplay==true){
//               COMPAREMouseOn.on("mousemove",function(d){
//                   d3.select(this)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseMoveOpacity=="none"){return "";}else{return self.settings.COMPAREMouseMoveOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseMoveStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseMoveStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseMoveStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseMoveStrokeWidth;} });
////                   COMPAREMouseOnTooltip.style("left", (d3.event.pageX) + "px")
////                   .style("top", (d3.event.pageY + 20) + "px");
//               })
//            }
//            if(self.settings.COMPAREMouseOutDisplay==true){
//               COMPAREMouseOn.on("mouseout",function(d){
////                   COMPAREMouseOnTooltip.style("opacity",0.0);
//                   d3.select(this)
//                       .transition()
//                       .duration(self.settings.COMPAREMouseOutAnimationTime)
//                       .style("opacity", function(d,i) { if(self.settings.COMPAREMouseOutOpacity=="none"){return "";}else{return self.settings.COMPAREMouseOutOpacity;} })
//                       .style("stroke", function(d,i) { if(self.settings.COMPAREMouseOutStrokeColor=="none"){return "";}else{return self.settings.COMPAREMouseOutStrokeColor;} })
//                       .style("stroke-width", function(d,i) { if(self.settings.COMPAREMouseOutStrokeWidth=="none"){return "";}else{return self.settings.COMPAREMouseOutStrokeWidth;} });
//               });
//            }
//
//        }
//    }
        console.log(chord)
const backgroundClick = svg.selectAll("path");
    //var   a=d3.event.translate[0]+circleCenter / 2
    //var   b=d3.event.translate[1]+height / 2
    //svg.attr("transform", "translate(" + a +","+ b + ")scale(" + d3.event.scale + ")");
    backgroundClick.on("click",function(d){
      console.log("click",d)
      //d3.behavior.zoom()
            //console.log(d3.event.scale)
      var   svg = d3.select(self.target).append("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("class",svgClassName)
              .attr("id",svgClassName)
              .call(
                   d3.behavior.zoom().on("zoom", function () {
                    svg.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
              }))
            .append("g")
//              .attr("transform", "translate(" + (circleCenter + compareMoveDistance) + "," + height / 2 + ")");
              .attr("transform", "translate(" + circleCenter + "," + height / 2 + ")");
      })

      return svg.node();
    }
//}($));
