var track0 = document.querySelectorAll('.track-0 .block');
var track1 = document.querySelectorAll('.track-1 .block');
var track2 = document.querySelectorAll('.track-2 .block');
var track3 = document.querySelectorAll('.track-3 .block');
var alltracks = new Map([
    [track0,[track1,track2,track3]],
    [track1,[track0,track2,track3]],
    [track2,[track0,track1,track3]],
    [track3,[track0,track1,track2]]
  ]
)
 //
  for (let entry of alltracks.entries()){
    const track = entry[0];
    const tracks = entry[1];
    console.log(track)
    track.forEach((b,index) => b.addEventListener('mouseover', () => {
       console.log('clicked',b.__data__.key);//b.__data__.key is the chromesome id 
       tracks.forEach(t => changeBackground(t,b.__data__.key,"aqua"))
    }));
    track.forEach((b,index) => b.addEventListener('mouseout', () => {
      console.log(track)
       //tracks.forEach(t => changeBackground(t,b.__data__.key,"red"))
    }));
  }
//}

function changeBackground(track, chromesomeId, color){
      for(var t in track){
      const svgDoc = track[t];
      if (svgDoc.nodeName === "g"){
        if (svgDoc.__data__.key === chromesomeId){
          var s = svgDoc.querySelector('.background')
          s.setAttribute("fill",color)
          s.setAttribute("opacity","0.5")
        }
        
      }
    }

}
