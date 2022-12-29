const iframeCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>NGCircos.js</title>
    <link href="css/bootstrap.min.css " rel="stylesheet">
    <link href="css/metisMenu.min.css" rel="stylesheet">
    <link href="css/timeline.css" rel="stylesheet">
    <!-- <link href="css/sb-admin-2.css" rel="stylesheet"> -->
    <link href="css/morris.css" rel="stylesheet">
    <link href="css/font-awesome.min.css" rel="stylesheet" type="text/css">
    <link href="css/google-code-prettify.css" rel="stylesheet">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.1/jquery.min.js"></script>
    <script src="css/bootstrap.min.js"></script>
    <script src="css/metisMenu.min.js" ></script>
    <script src="css/raphael-min.js"></script>
    <script src="css/morris.min.js"></script>
    <!-- <script src="css/sb-admin-2.js"></script> -->
    <script src="css/google-code-prettify.js"></script>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.map"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-sb-admin-2/4.1.4/js/sb-admin-2.min.js" crossorigin="anonymous"></script>
    <link src="https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-sb-admin-2/4.1.4/css/sb-admin-2.css"  rel="stylesheet"></script>
    <link src="https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-sb-admin-2/4.1.4/css/sb-admin-2.min.css"  rel="stylesheet"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/startbootstrap-sb-admin-2/4.1.4/js/sb-admin-2.js" crossorigin="anonymous"></script>
     <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!-- [if lt IE 9]> -->
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <!-- <![endif] -->
</head>
<body onload="prettyPrint()">

 
<h3>Visualization of CNV data using NG-Circos<a class="headerlink"></a></h3>


<!-- <button class="svg-action-btn download-img" style="height: 18px;line-height: 18px;padding: 0 11px;background: #FFFFFF;border: 1px #D9D9D9 solid;border-radius: 3px;display: inline-block;font-size: 12px;outline: none;color: black">Download png ↓</button> -->
<button class="svg-action-btn download-img" style="height: 18px;line-height: 18px;padding: 0 11px;background: #FFFFFF;border: 1px #D9D9D9 solid;border-radius: 3px;display: inline-block;font-size: 12px;outline: none;color: black">Download png ↓</button>
<button id="downloadSVG">Download .svg</button>
<div id="NGCircos">test</div>
            
<!-- Data configuration -->
<script src="./lib/jquery.js" ></script>
<script src="./lib/d3.js"> </script>
<script src="./lib/NGCircos.js"></script>
<script src="./js/BACKGROUND01.js"></script>
<script src="./js/CNV01.js"></script>
<script src="./js/BACKGROUND02.js"></script>
<script src="./js/CNV02.js"></script>
<script src="./js/BACKGROUND03.js"></script>
<script src="./js/CNV03.js"></script>
<!-- Genome configuration -->
<script>
  var NGCircosGenome = [      // Configure your own genome here.
    [
     ["1" , 249250621],
     ["2" , 243199373],
     ["3" , 198022430],
     ["4" , 191154276],
     ["5" , 180915260],
     ["6" , 171115067],
     ["7" , 159138663],
     ["8" , 146364022],
     ["9" , 141213431],
     ["10" , 135534747],
     ["11" , 135006516],
     ["12" , 133851895],
     ["13" , 115169878],
     ["14" , 107349540],
     ["15" , 102531392],
     ["16" , 90354753],
     ["17" , 81195210],
     ["18" , 78077248],
     ["19" , 59128983],
     ["20" , 63025520],
     ["21" , 48129895],
     ["22" , 51304566],
     ["X" , 155270560],
     ["Y" , 59373566]
    ]
  ];
  NGCircos01 = new NGCircos(CNV01, BACKGROUND01, CNV02, BACKGROUND02, CNV03, BACKGROUND03,NGCircosGenome,{       // Initialize NGCircos.js with "NGCircosGenome" and Main configuration
     zoom : true,
     target : "NGCircos",                              // Main configuration "target"
     svgWidth : 900,                                  // Main configuration "svgWidth"
     svgHeight : 600,                                 // Main configuration "svgHeight"
     svgClassName: "NGCircos",                  // Main configuration "svgClassName"
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
     CNVMouseOutColor: "red",
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
     CNVMouseOverArcStrokeWidth: 3,
  });
  NGCircos01.draw_genome(NGCircos01.genomeLength);  // NGCircos.js callback
  NGCircos01.draw_genome(NGCircos01.genomeLength2); // NGCircos2.js callback second time
</script>
<script src="./lib/saveSvgAsPng.js" ></script>
<script>
      (function(){
        var downloadImg = getEle(".download-img"),
          imgName = getEle("."+NGCircos01.svgClassName);
          //console.log(imgName)
         // imgScale = getEle(".img-scale");

        downloadImg.addEventListener("click",function(){
          var mySvg = getEle("."+NGCircos01.svgClassName),
            //iImgScale = parseInt(imgScale.value) || 1,
            oImgName = imgName.value || NGCircos01.svgClassName;

          //saveSvgAsPng(mySvg, oImgName+".png", iImgScale);
          saveSvgAsPng(mySvg, oImgName+".png");
        })

        function getEle(obj){
          var d = document;
          return d.querySelector(obj);
        }
      })()
</script>
<script>
    function downloadSVGAsText() {
        const svg = document.querySelector('svg');
        const svgdata = svg.outerHTML.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg" ')
        const base64doc = btoa(unescape(encodeURIComponent(svgdata)));
        const a = document.createElement('a');
        const e = new MouseEvent('click');
        a.download = 'download.svg';
        a.href = 'data:image/svg+xml;base64,' + base64doc;
        a.dispatchEvent(e);
      }
    const downloadSVG = document.querySelector('#downloadSVG');
    downloadSVG.addEventListener('click', downloadSVGAsText);
</script>

      
</body>
</html>`
export default iframeCode;

