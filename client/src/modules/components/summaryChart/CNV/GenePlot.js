import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import { packRanges } from '../../utils.js'
import axios from "axios";

function GenePlot(props) {
 const [genes, setGenes] = useState([]);
 const [showGene, setShowGene] = useState(false);

  useEffect(() => {
    if (true) {
        handleQuery()
    } else {
     
    }
  }, [props]);
  async function handleQuery() {
    //setLoading(true)
    const query= {"xMin":props.xMin,"xMax":props.xMax,"chr":props.chr}
    const response = await axios.post("api/opensearch/gene", { search: query })
    const results = response.data
    //console.log("genes",results)
    const genearr = []
    results.forEach(r=>{
      if (r._source !== null){
        const g = r._source
        g.transcriptionEnd= Number(g.transcriptionEnd)
        g.transcriptionStart = Number(g.transcriptionStart)
        g.exonEnds = g.exonEnds.map(Number)
        g.exonStarts = g.exonStarts.map(Number)
          genearr.push(r._source)
      }

      
    })
    //setLoading(false)
    setGenes(genearr)
    if (genearr.length > 0){
       setShowGene(true)
    }
    else{
       setShowGene(false)
    }
    console.log(genearr)
  }
  let geneRanges = genes.map(gene => {
      let horizPadding = 10000;
      return [gene.transcriptionStart - horizPadding, gene.transcriptionEnd + horizPadding, gene];
    });

  let packedGeneRanges = packRanges(geneRanges);

  const geneHeight =100
  const genePlotHeight = packedGeneRanges.length*geneHeight
  const rowpadding = 20
  var geneLine = []
  var pos = []
  var annotation = [];
  var ypos = []
  packedGeneRanges.forEach((ge,index)=>{
    ge.forEach(ae=>{
    const e = ae[2]
    //the gene horizatal line which connects all vertical lines for one gene
    const hoverText = "Name: "+e.name+"<br>Start: "+e.transcriptionStart+"<br>End: "+e.transcriptionEnd; 
    const yGene = geneHeight*(index) 
 
    const gl = {
                x:[e.transcriptionStart,e.transcriptionEnd],
                y:[genePlotHeight-(yGene+geneHeight/2),genePlotHeight-(yGene+geneHeight/2)],
                line: {
                  color: 'grey', // set the line color 
                  width:5
                },
                mode: 'lines',
                hovertemplate: hoverText,
              }
    geneLine.push(gl);

    e.exonEnds.forEach((ex,index)=>{
    
    const p = (ex-e.exonStarts[index])/2+e.exonStarts[index]
    pos.push(p)
    ypos.push(yGene)
    //create annotation for each gene
    const a = {
        x: (e.transcriptionStart+e.transcriptionEnd)/2 ,
        y: genePlotHeight-yGene-rowpadding,
        //add left arrow or right arrow for gene name
        text: (e.strand==="-"?'&#8592; ':'')+ e.name + (e.strand==="+"?' &#8594;':''),
        showarrow: false,
        font: {
          family: 'Arial',
          size: 12,
          color: '#000000',
        },
        xref: 'x',
        yref: 'y',
        align: 'center',
        xanchor: 'center',
        yanchor: 'bottom',
    }
    annotation.push(a)
   })
  })
})
  
  const data = geneLine

  var shapelist = [];
 // console.log(ypos,pos)
 //the vertical line for each exonStart-exonEnd pair
  pos.forEach((g,index)=>{
    const s = {
      type:'line',
      x0:g,
      x1:g,
      y0:genePlotHeight-ypos[index]-rowpadding,
      y1:genePlotHeight-(geneHeight+ypos[index])+rowpadding,
      line: {
          color: 'grey',
          width: 2,
          dash: 'solid',
        }
    }
    shapelist.push(s)
  })
  //console.log(shapelist)

  const layout = {
   xaxis: {
    },
    yaxis: {
      showgrid: false,
      zeroline: false,
      showticklabels: false,
      fixedrange:true
    },
    shapes: shapelist,
    height:genePlotHeight,
    width:props.width,
    showlegend: false, // turn off the legend icon
    autosize: true, // disable autosize to fix the x-axis zoom issue
    annotations:annotation,
    margin: { l: 40, r: 20, t: 5, b: 30 },
    
  };

 
  return (
    showGene?
    <Plot
      data={data}
      layout={layout}
    />:''
  )
}




export default GenePlot;


// const genes = [
//     {name:"CPNE5",start:36740772,end:36839444,
//     exonStarts:[36740772,36743688,36744267,36745047,36745387,36746143,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36740772,36743688,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36740772,36743688,36744267,36745047,36745387,36746395,36748220,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36740777,36743688,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36838695,36839282,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36743690,36744267,36745047,36745387,36746395,36748220,36752579,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36744331,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36839282,,36797384,36798164,36798454,36799966,36822113,36823057,36839282,,36740772,36743688,36744267,36745047,36745387,36746395,36748220,36756244,36762916,36765334,,36740777,36743688,36744267,36745047,36745387,36746395,36748220,36752579,36753033,36756244,36757284,,36740777,36743688,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36757284,,36740777,36743688,36744267,36745047,36745387,36746395,36748220,36756244,36757284,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36787155,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36821734,,36743233,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36762916,36765334,36774960,36778853,36792032,36792395,36794589,36798164,36798454,36799966,36822113,36823057,36827327,,36743237,36744267,36745047,36745387,36746395,36748220,36753033,36756244,36757284,], 
//     exonEnds:  [36742486,36743762,36744325,36745150,36745515,36746215,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36838782,36839372,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36743762,36744325,36745150,36745515,36746577,36748267,36752620,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36744526,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36839444,,36797666,36798241,36798494,36800070,36822160,36823098,36839444,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36756298,36762992,36765376,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36752620,36753095,36756298,36757409,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36757409,,36742486,36743762,36744325,36745150,36745515,36746577,36748267,36756298,36757409,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36787230,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36821853,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36762992,36765376,36775065,36778957,36792096,36792446,36794649,36798241,36798494,36800070,36822160,36823098,36827829,,36743762,36744325,36745150,36745515,36746577,36748267,36753095,36756298,36757400,],
//     strand:"-",
//   },
//   {name:"C6orf89",start:36834885,end:36928964,
//     exonStarts:[36834885,36879007,36883187,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36871869,36879007,36883187,36899425,36902279,36914283,36914553,36916444,36919577,36923346,,36874896,36878065,36879007,36883187,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36874955,36879007,36883187,36894503,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36875111,36879007,36883187,36894503,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36879435,36883187,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36885863,36899425,36902220,36914283,36914553,36916444,36919577,36923346,,36885863,36894503,36899425,36902279,36914283,36914553,36916444,36919577,36923346,,36885863,36894503,36899425,36902220,36914283,36914553,36916444,36919577,36923346,], 
//     exonEnds:  [36835316,36879132,36883352,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36871967,36879132,36883352,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36875047,36878107,36879132,36883352,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36875047,36879132,36883352,36894603,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36875749,36879132,36883352,36894603,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36879480,36883352,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36886028,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36886028,36894603,36899633,36902434,36914435,36914693,36916574,36919701,36928964,,36886028,36894603,36899633,36902434,36914435,36914693,36916574,36919701,36928964,],
//     strand:"+",
//   },
//     {name:"PPIL1",start:36854828,end:36875024,
//     exonStarts:[36854828,36856585,36871717,36874716,], 
//     exonEnds:  [36856033,36856654,36871872,36875024,],
//     strand:"-",
//   },
//     {name:"PI16",start:36948262,end:36964837,
//     exonStarts:[36948262,36954679,36959144,36961450,36961885,36962934,36963822,36964385,,36954432,36959144,36961450,36961885,36962934,36963822,36964385,,36954672,36959144,36961450,36961885,36962934,36963822,36964385,,36954672,36959144,36961450,36961885,36962934,36963822,36964241,,36954672,36959144,36961450,36961885,36962934,36963822,36964241,], 
//     exonEnds:  [36948404,36954931,36959366,36961560,36961974,36963612,36963962,36964837,,36954931,36959366,36961560,36961974,36963612,36963962,36964837,,36954931,36959366,36961560,36961974,36963033,36963962,36964837,,36954931,36959366,36961560,36961974,36963033,36963962,36964837,,36954931,36959366,36961560,36961974,36963612,36963962,36964837,],
//     strand:"+",
//   },
//     {name:"MTCH1",start:36968134,end:36987171,
//     exonStarts:[36968134,36970038,36970405,36970646,36972702,36975657,36977198,36977633,36978077,36978504,36981587,36985852,,36968134,36970038,36970405,36970646,36972651,36975657,36977198,36977633,36978077,36978504,36981587,36985852,,36968134,36970038,36970405,36970646,36972702,36975657,36977198,36977633,36978077,36978504,36981587,36985852,,36968140,36970405,36970646,36972651,36975657,36977198,36977633,36978077,36978504,36985852,,36968140,36970038,36970405,36970646,36972651,36975657,36977198,36977633,36978077,36978504,36985852,,36968140,36970405,36970646,36972651,36975657,36977198,36977633,36978077,36978504,36981587,36985852,,36969171,36970405,36970646,36972702,36975657,36977198,36977633,36978077,36978504,36985852,,36969171,36970405,36970646,36972702,36975657,36977198,36977633,36978077,36978504,36981587,36985852,], 
//     exonEnds:  [36968974,36970114,36970473,36970694,36972796,36975717,36977250,36977784,36978155,36978611,36981672,36986551,,36968974,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36981672,36986551,,36968974,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36981672,36986551,,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36986144,,36968974,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36986144,,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36981672,36987171,,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36986144,,36970114,36970473,36970694,36972796,36975717,36977250,36977691,36978155,36978611,36981672,36987171,],
//     strand:"-",
//   },
//     {name:"FGD2",start:37005646,end:37029072,
//     exonStarts:[37005646,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37025791,37027428,37027947,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37017516,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015799,37017516,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015799,37020540,37020708,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025216,37025791,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37025791,37026090,37027428,37027947,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37027428,37027947,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37005654,37008833,37010972,37011705,37013608,37013961,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37025791,37026090,37027428,37027947,,37005817,37008833,37010972,37011705,37013608,37013966,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37013024,37013966,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37013675,37014645,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37014024,37014580,37014891,37015767,37020540,37020708,37021511,37022238,37024772,37025791,37026090,37027428,37027947,,37014030,37014580,37014891,37015767,37020540,37020708,37021511,37022238,37025791,37026090,37027428,37027947,],
//     exonEnds:  [37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37025938,37027575,37029069,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37019879,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37019882,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020745,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025329,37025878,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37025938,37027334,37027575,37029070,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027575,37029070,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37026325,37027575,37029070,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027334,37027575,37029070,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37025938,37026325,37027575,37029072,,37005885,37009065,37011050,37011854,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027334,37027575,37029070,,37013765,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027334,37027575,37029070,,37013765,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027334,37027575,37029070,,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37024793,37025938,37027334,37027575,37029070,,37014100,37014704,37015038,37015860,37020620,37020739,37021604,37022370,37025938,37027334,37027575,37029070,],
//     strand:"+",
//   }
// ]