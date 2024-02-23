import * as React from "react";
import { useEffect, useState, useRef } from "react";
import layout from "./layout2.json";
import layoutxy from "./layoutxy.json";
import "./css/circos.css";
import SingleChromosome from "./SingleChromosome";
import { Row, Col, Button, Container, Table } from "react-bootstrap";
import { formState } from "../../../mosaicTiler/explore.state";
import { useRecoilState } from "recoil";
import Legend from "../../../components/legend";
import axios from "axios";
import CircosPlot from "./CirclePlot";
import CircosPlotCompare from "./CirclePlotCompare";
import * as htmlToImage from "html-to-image";
import jsPDF from "jspdf";
import { AncestryOptions, initialX, initialY, smokeNFC, SexOptions } from "../../../mosaicTiler/constants";
import { fisherTest } from "../../utils";

//import { saveAs } from "file-saver";
//import ChromosomeCompare from "./ChromosomeCompare";
//import { groupSort } from "d3";

const hovertip = (d) => {
  return (
    "<p style='text-align:left'>Sample ID: " +
    d.sampleId +
    "<br> Study: " +
    d.dataset +
    "<br> Type: " +
    d.type +
    "<br> Cellular Fraction: " +
    d.value +
    "<br> Start: " +
    d.start +
    "<br> End: " +
    d.end +
    "<br> Ancestry: " +
    d.PopID +
    "<br> Sex: " +
    d.sex +
    "<br> Age: " +
    d.age +
    "<br> Smoke: " +
    d.smokeNFC +
    " " +
    "</p>"
  );
};

function changeBackground(track, chromesomeId, opacity) {
  for (var t in track) {
    const svgDoc = track[t];
    if (svgDoc.nodeName === "g") {
      if (svgDoc.__data__.key === chromesomeId) {
        var s = svgDoc.querySelector(".background");
        //s.setAttribute("fill","white")
        s.setAttribute("opacity", opacity);
      }
    }
  }
}

export default function CirclePlotTest(props) {
  //to show singleChrome chart
  const [form, setForm] = useRecoilState(formState);
  const [chromesomeId, setChromesomeId] = useState(props.compare ? 0 : form.chrCompare.label);
  const [showChart, setShowChart] = useState(form.plotType.value === "circos" ? false : true);
  const [countFilter, setCountFilter] = useState(0);
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);
  const [titleA, setTitleA] = useState("A");
  const [titleB, setTitleB] = useState("B");
  const [msgA, setMsgA] = useState("");
  const [msgB, setMsgB] = useState("");
  const [msg, setMsg] = useState("");
  const [commonTitle, setCommonTitle] = useState("Test");
  const [circleA, setCircleA] = useState(null);
  const [circleB, setCircleB] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [browserSize, setBrowserSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [zoomRangeA, setZoomRangeA] = useState(null);
  const [zoomRangeB, setZoomRangeB] = useState(null);
  //isCompare is used to decide the figure is summary plot or compare plot
  //if it is summary plot, the resize if browser width changes
  //if it is compare plots, do not resize
  const [isCompare, setIsCompare] = useState(false);
  //use this figuresHeight to control the height after gene table created
  const [figureHeight, setFigureHeight] = useState(0);
  //
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomRange, setZoomRange] = useState(null);
  const [rangeLabel, setRangeLabel] = useState("");
  const [isinit, setIsinit] = useState(false);
  const [circleTableData, setCircleTableData] = useState([]);
  const [circosTitle, setCircosTitle] = useState("");
  const [fisherA, setFisherA] = useState(0);
  const [fisherB, setFisherB] = useState(0);
  const [rangeA, setRangeA] = useState(0);
  const [rangeB, setRangeB] = useState(0);
  const [Pfisher, setPfisher] = useState(0);
  const compareRef = useRef(isCompare);

  const showChartRef = useRef(showChart);
  const zoomRangeRef = useRef(zoomRange);
  const tableRef = useRef(tableData);

  useEffect(() => {
    setShowChart(form.plotType.value === "static");
    showChartRef.current = form.plotType.value === "static";
    form.plotType.value === "static"
      ? form.compare
        ? setChromesomeId(form.chrCompare ? form.chrCompare.label : "")
        : setChromesomeId(form.chrSingle ? form.chrSingle.label : "")
      : setChromesomeId(0);
  }, [form.plotType, form.chrCompare]);
  useEffect(() => {
    if (!showChart) setForm({ ...form, plotType: { value: "circos", label: "All chromosomes" } });
  }, [showChart]);
  //update compareRef when isCompare changes
  useEffect(() => {
    compareRef.current = isCompare;
  }, [isCompare]);
  //update compareRef when isCompare changes
  useEffect(() => {
    showChartRef.current = showChart;
  }, [showChart]);
  useEffect(() => {
    zoomRangeRef.current = zoomRange;
  }, [zoomRange]);
  useEffect(() => {
    tableRef.current = tableData;
  }, [tableData]);

  let adjustWidth = 1;
  let minFigSize = window.innerWidth < 600 ? 450 : 535;
  minFigSize = window.innerWidth < 500 ? 350 : 450;

  if (browserSize.width > 1200 && browserSize.width < 1600) adjustWidth = 0.64;
  else if (browserSize.width >= 1600) adjustWidth = 0.48;
  else adjustWidth = 0.7;

  const size = browserSize.width < 900 ? minFigSize : browserSize.width * adjustWidth;
  const compareCircleSize = minFigSize;
  let singleChromeSize = size < 900 ? minFigSize - 100 : size * 0.8;
  let singleFigWidth = size < 900 ? minFigSize - 100 : size * 0.7;

  const clearBtn = document.getElementById("clearCompare");

  const handleBrowserResize = () => {
    setBrowserSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  // useEffect(() => {
  //   window.addEventListener("resize", handleBrowserResize);
  //   console.log("resizing...", browserSize);
  //   return () => {
  //     window.removeEventListener("resize", handleBrowserResize);
  //   };
  // }, []);

  const [circle, setCircle] = useState({
    loss: props.loss,
    gain: props.gain,
    loh: props.loh,
    undetermined: props.undetermined,
    chrx: form.chrX,
    chry: form.chrY,
  });

  const circleRef = useRef(null);
  useEffect(() => {
    setCircle({
      loss: props.loss,
      gain: props.gain,
      loh: props.loh,
      undetermined: props.undetermined,
      chrx: props.chrx,
      chry: props.chry,
    });
    //circleRef.current.focus();
    //console.log(props);
  }, [props]);

  const sendClickedId = (id) => {
    props.clickedChromoId(id);
  };

  const changeXYbackcolor = () => {
    if (circleRef.current) {
      var track0 = circleRef.current.querySelectorAll(".track-0 .block");
      var track1 = circleRef.current.querySelectorAll(".track-1 .block");
      var track2 = circleRef.current.querySelectorAll(".track-2 .block");
      var track3 = circleRef.current.querySelectorAll(".track-3 .block");
      var alltracks = [track0, track1, track2, track3];
      alltracks.forEach((track) => {
        track.forEach((b) => {
          const bck = b.querySelector(".background");
          if (b.__data__.key === "X" || b.__data__.key === "Y") {
            bck.setAttribute("fill", "white");
            bck.setAttribute("opacity", 0);
          }
        });
      });
    }
  };

  useEffect(() => {
    // call api or anything
    //console.log("backgroudcolor");
    changeXYbackcolor();
  });

  const handleEnter = () => {
    console.log("handleEnter");
    if (circleRef.current) {
      var track0 = document.querySelectorAll(".track-0 .block");
      var track1 = document.querySelectorAll(".track-1 .block");
      var track2 = document.querySelectorAll(".track-2 .block");
      var track3 = document.querySelectorAll(".track-3 .block");
      //var trackxy = circleRef.current.querySelectorAll('#chrxy .track-0');
      var alltracks = [track0, track1, track2, track3];
      console.log(alltracks.length);
      alltracks.forEach((track) => {
        track.forEach((b) => {
          const bck = b.querySelector(".background");
          bck.addEventListener("mouseover", () => {
            // console.log("mouseover", bck, b.__data__.key); //b.__data__.key is the chromesome id
            if (b.__data__.key !== "X" && b.__data__.key !== "Y")
              alltracks.forEach((t) => changeBackground(t, b.__data__.key, 1));
            else alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0.5));
          });
          bck.addEventListener("mouseout", () => {
            if (b.__data__.key !== "X" && b.__data__.key !== "Y")
              alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0.5));
            else alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0));
          });
          bck.addEventListener("click", () => {
            console.log("click", b.__data__.key);
            setShowChart(true);
            props.onClickedChr(true);
            setChromesomeId(b.__data__.key);
            sendClickedId(b.__data__.key);
            const cid = "chr" + b.__data__.key;
            const chrid = form.chromosome.filter((c) => c.value === cid);
            setForm({
              ...form,
              chromosome: chrid,
              plotType: { value: "static", label: "Chromosome level" },
              chrCompare: { value: "chr" + b.__data__.key, label: b.__data__.key },
              chrSingle: { value: "chr" + b.__data__.key, label: b.__data__.key },
              end: layout.filter((c) => c.id === b.__data__.key + "")[0].len,
            });
            if (form.compare) {
              document.getElementById("compareSubmit").click();
            }
          });
        });
      });
    }
  };

  const handleBack = () => {
    setShowChart(false);
    sendClickedId(-1);
    setZoomRange(null);
    props.onClickedChr(false);
    setIsCompare(false);
    setForm({
      ...form,
      compare: false,
      showCompare: false,
      counterSubmitted: 0,
      chrSingle: null,
      start: 0,
      end: "",
      plotType: { value: "circos", label: "Whole chromosome" },
      chromosome: Array.from({ length: 22 }, (_, i) => i + 1)
        .map((i) => {
          return { value: "chr" + i, label: i };
        })
        .concat({ value: "chrX", label: "X" })
        .concat({ value: "chrY", label: "Y" }),
    });
    props.onResetHeight();
    setChromesomeId(0);
    setFigureHeight(0);
    //clearBtn.click();
    //console.log(window.innerWidth, size);
    const summarybtn2 = document.getElementById("summarySubmit");
    //summarybtn2.click();
    if (window.innerWidth < 1200 && size > 850) {
      summarybtn2.click();
    }
    if (window.innerWidth < 980 && size > 600) {
      summarybtn2.click();
    }
    if (window.innerWidth > 980 && size < 700) {
      summarybtn2.click();
    }
    if (window.innerWidth > 1200 && size < 600) {
      summarybtn2.click();
      //console.log("back:", window.innerWidth, size);
    }
    //if pairwise is checked, then uncheck it
    if (document.getElementById("paircheck").checked === true) {
      props.onPair();
    }
  };
  const handleBackChromo = () => {
    setForm({ ...form, compare: false });
    setFigureHeight(0);
    props.onResetHeight();
    setZoomRangeA(null);
    setZoomRangeB(null);
    //clearBtn.click();
  };

  const handleCircosCompareBack = () => {
    setShowChart(false);
    setChromesomeId(0);
    setForm({ ...form, plotType: { value: "circos", label: "Circos" } });
    document.getElementById("compareSubmit").click();
    //console.log(circleA);
    setZoomRangeA(null);
    setZoomRangeB(null);
    console.log("back", form);
  };

  const handleZoomChange = (event, group, lastView) => {
    //Apply the zoom range only to the plot that did not trigger
    if (group === "A") {
      setZoomRangeB(event);
      //setZoomRangeA(null);
    }
    if (group === "B") {
      setZoomRangeA(event);
      //setZoomRangeB(null);
    }
  };

  async function handleFisherTest(a, b, c, d) {
    const matrix = [a, b - a, c, d - c];
    console.log(matrix);
    if (b >= a && d >= c) {
      const pvalue = await axios.post("api/fishertest", matrix);
      console.log(pvalue.data);
      setPfisher(pvalue.data.pValue);
    }
  }

  let data = [];
  useEffect(() => {
    // console.log(form.counterCompare, form.groupA, form.groupB);
    if (form.compare) {
      //console.log(showChart, form.groupA, form.groupB, compareRef);
      setIsCompare(true);
      //if click back to Circos compare from single chromosome, do not clear circos data
      if (chromesomeId === 0) {
        setCircleA(null);
        setCircleB(null);
      }
      setTableData([]);
      setCircleTableData([]);

      setGroupA([]);
      setGroupB([]);
      console.log(form);
      if (form.counterCompare > 0) {
        handleGroupQuery(form.groupA).then((data) =>
          showChart ? (setGroupA(data[0]), setFisherA(data[1])) : setCircleA({ ...data })
        );
        handleGroupQuery(form.groupB).then((data) =>
          showChart ? (setGroupB(data[0]), setFisherB(data[1])) : setCircleB({ ...data })
        );
      }
    } else {
      //console.log("clear form");
    }
    if (form.groupA.length === 0 && form.groupB.length === 0) {
      setCircleA(null);
      setCircleB(null);
      setTableData([]);
      setCircleTableData([]);

      //console.log("clear circle data");
    }
    setCommonTitle(checkGroupTitleForDup());
  }, [form.counterCompare]);

  data = [
    ...props.gain.filter((chr) => chr.block_id === chromesomeId + ""),
    ...props.loh.filter((chr) => chr.block_id === chromesomeId + ""),
    ...props.loss.filter((chr) => chr.block_id === chromesomeId + ""),
    ...props.undetermined.filter((chr) => chr.block_id === chromesomeId + ""),
    ...props.chrx.filter((chr) => chr.block_id === chromesomeId + ""),
    ...props.chry.filter((chr) => chr.block_id === chromesomeId + ""),
    // ...props.chry.filter(chr=>chr.block_id===chromesomeId)
  ];

  //do query for group compare:
  async function handleGroupQuery(group) {
    //setLoading(true)
    const result = [];
    let responseDeno = [];
    let query = {};
    let response = "";
    let circleTemp = {};
    let gainTemp = [];
    let lohTemp = [];
    let lossTemp = [];
    let undeterTemp = [];
    let chrXTemp = [];
    let chrYTemp = [];

    if (form.chrX && form.chrY) {
      gainTemp = [...initialX, ...initialY];
      lossTemp = [...initialX, ...initialY];
      lohTemp = [...initialX, ...initialY];
      undeterTemp = [...initialX, ...initialY];
    }
    if (form.chrX && !form.chrY) {
      gainTemp = [...initialX];
      lossTemp = [...initialX];
      lohTemp = [...initialX];
      undeterTemp = [...initialX];
    }
    if (!form.chrX && form.chrY) {
      gainTemp = [...initialY];
      lossTemp = [...initialY];
      lohTemp = [...initialY];
      undeterTemp = [...initialY];
    }

    if (true) {
      if (chromesomeId > 0 || chromesomeId === "X" || chromesomeId === "Y") {
        query = {
          ...group,
          chr: chromesomeId,
          start: form.start,
          end: form.end,
          mincf: group.minFraction,
          maxcf: group.maxFraction,
          ancestry: group.ancestry,
          smoking: group.smoking,
          array: group.approach,
          sex: group.sex,
          minAge: group.minAge,
          maxAge: group.maxAge,
        };
        console.log(query);
        responseDeno = await axios.post("api/opensearch/denominator", query);
        console.log(responseDeno.data);

        response = await axios.post("api/opensearch/chromosome", query);
      } else {
        console.log("do query...", form.counterCompare, group);
        //const dataset = group.study;
        const sex = group.sex;
        //{ dataset: qdataset, sex: qsex }
        // console.log(group);
        const dataset = [...group.study, form.chrX ? { value: "X" } : "", form.chrY ? { value: "Y" } : ""];
        response = await axios.post("api/opensearch/mca", {
          dataset: dataset,
          sex: sex,
          mincf: group.minFraction,
          maxcf: group.maxFraction,
          ancestry: group.ancestry,
          types: group.types,
          smoking: group.smoking,
          array: group.approach,
          minAge: group.minAge,
          maxAge: group.maxAge,
        });
      }

      let results = null;
      let responseDenominator = null;
      // console.log(group.smoking.length, group.approach.length, group.ancestry.length, group.sex.length);
      if (
        (group.smoking === undefined || group.smoking.length === 0) &&
        (group.approach === undefined || group.approach.length === 0) &&
        (group.ancestry === undefined || group.ancestry.length === 0) &&
        (group.sex === undefined || group.sex.length === 0)
      ) {
        results = response.data.denominator;
        responseDenominator = response.data.nominator;
      } else {
        results = response.data.nominator;
        responseDenominator = response.data.denominator;
      }
      //console.log(results, responseDenominator);
      const mergedResult = responseDenominator.map((itemA) => {
        let nominatorItem = results.find((itemB) => itemB._source.sampleId === itemA._source.sampleId);
        // const { age, sex, ancestry, ...restItems } = nominatorItem;
        if (nominatorItem !== undefined)
          return {
            ...itemA._source,
            ...nominatorItem._source,
          };
        else
          return {
            ...itemA._source,
          };
      });

      mergedResult.forEach((r) => {
        //if (r._source !== null) {
        const d = r;
        if (d.cf != "nan") {
          d.block_id = d.chromosome.substring(3);
          d.value = d.cf;
          d.dataset = d.dataset.toUpperCase();
          d.start = Number(d.beginGrch38);
          d.end = Number(d.endGrch38);
          d.length = Number(d.length);
          if (d.PopID !== undefined) {
            const dancestry = AncestryOptions.filter((a) => a.value === d.PopID);
            d.PopID = dancestry !== undefined ? dancestry[0].label : "";
          }
          if (d.smokeNFC !== undefined) {
            const dsmoking = smokeNFC.filter((a) => a.value === d.smokeNFC);
            d.smokeNFC = dsmoking !== undefined && dsmoking.length > 0 ? dsmoking[0].label : "NA";
          }
          if (d.sex !== undefined) {
            const dsex = SexOptions.filter((a) => a.value === d.sex);
            d.sex = dsex !== undefined && dsex.length > 0 ? dsex[0].label : "NA";
          }

          //
          if (d.chromosome != "chrX") {
            if (d.type === "Gain") gainTemp.push(d);
            else if (d.type === "CN-LOH") lohTemp.push(d);
            else if (d.type === "Loss") lossTemp.push(d);
            else if (d.type === "Undetermined") undeterTemp.push(d);
          }
          if (form.chrX && d.type == "mLOX") {
            chrXTemp.push(d);
            d.block_id = "X";
          }
          if (form.chrY && d.type == "mLOY") {
            chrYTemp.push(d);
            d.block_id = "Y";
          }
          result.push(d);
        }
      });
    }
    circleTemp = {
      loss: lossTemp,
      gain: gainTemp,
      loh: lohTemp,
      undetermined: undeterTemp,
      chrx: chrXTemp,
      chry: chrYTemp,
    };
    //setTableData([...result, ...tableData]);
    //console.log(circleTemp);

    if (showChart) return [result, responseDeno.data];
    else return circleTemp;
  }

  // useEffect(() => {
  //   setCommonTitle(checkGroupTitleForDup());
  // }, [titleA, titleB]);
  const checkGroupTitleForDup = () => {
    let titleGroup = "";
    let tempA = "";
    let tempB = "";
    for (let key in form.groupA) {
      // console.log(form.groupA[key], form.groupB[key]);
      let itemA = form.groupA[key];
      let itemB = form.groupB[key];
      let itemTitle = "";

      if (Array.isArray(itemA)) {
        if (itemA.length === itemB.length) {
          itemTitle = "; " + key.charAt(0).toUpperCase() + key.slice(1) + ": ";
          if (itemA.length > 0) {
            for (let i = 0; i < itemA.length; i++) {
              if (itemA[i].value !== itemB[i].value) {
                itemTitle = "";
                tempA += groupTitle({ [key]: itemA });
                tempB += groupTitle({ [key]: itemB });
                break;
              } else {
                itemTitle += itemA[i].label;
                if (i < itemA.length - 1) itemTitle += ",";
              }
            }
          } else {
            itemTitle += " All";
          }
        } else {
          tempA += groupTitle({ [key]: itemA });
          tempB += groupTitle({ [key]: itemB });
        }
      }
      titleGroup += itemTitle;
    }

    let agecfA = groupAgeTitle(form.groupA);
    let agecfB = groupAgeTitle(form.groupB);
    if (agecfA === agecfB) titleGroup += agecfA;
    else {
      tempA += agecfA === "" ? "; Age: All" : agecfA;
      tempB += agecfB === "" ? "; Age: All" : agecfB;
    }
    agecfA = groupCfTitle(form.groupA);
    agecfB = groupCfTitle(form.groupB);
    if (agecfA === agecfB) titleGroup += agecfA;
    else {
      tempA += agecfA === "" ? "; CF: 0-1" : agecfA;
      tempB += agecfB === "" ? "; CF: 0-1" : agecfB;
    }
    //console.log(agecfA, agecfB);
    const [titleA, errorMessageA] = checkTitleStudyPlatForm(form.groupA, tempA);
    const [titleB, errorMessageB] = checkTitleStudyPlatForm(form.groupB, tempB);
    tempA = titleA;
    tempB = titleB;
    setTitleA(tempA.slice(1));
    setTitleB(tempB.slice(1));
    setMsgA(errorMessageA);
    setMsgB(errorMessageB);
    return titleGroup.slice(1);
  };

  const groupTitle = (group) => {
    let title = "";
    //console.log(group);
    for (let key in group) {
      const values = group[key];
      if (values !== undefined) {
        if (typeof values === "object" && Array.isArray(values) && values.length > 0) {
          title += "; " + key.charAt(0).toUpperCase() + key.slice(1) + ": ";
          values.forEach((s) => {
            title += s.label + ",";
          });
          title = title.slice(0, -1);
        } else if (typeof values === "object" && Array.isArray(values) && values.length === 0) {
          title += "; " + key.charAt(0).toUpperCase() + key.slice(1) + ": All";
        }
      }
    }
    title += groupAgeTitle(group);
    title += groupCfTitle(group);

    return title;
  };

  const singleTitle = (group) => {
    let title = "";
    //console.log(group);
    for (let key in group) {
      const values = group[key];
      if (values !== undefined) {
        if (typeof values === "object" && Array.isArray(values) && values.length > 0) {
          title += "; " + key.charAt(0).toUpperCase() + key.slice(1) + ": ";
          values.forEach((s) => {
            title += s.label + ",";
          });
          title = title.slice(0, -1);
        } else if (typeof values === "object" && Array.isArray(values) && values.length === 0) {
          title += "; " + key.charAt(0).toUpperCase() + key.slice(1) + ": All";
        }
      }
    }
    title += groupAgeTitle(group);
    title += groupCfTitle(group);

    const [tempTitle, errormsg] = checkTitleStudyPlatForm(group, title);
    setMsg(errormsg);
    //  console.log(tempTitle, errormsg);
    return tempTitle;
  };
  const groupAgeTitle = (group) => {
    let title = "";
    if (group != undefined) {
      if (group.maxAge !== undefined && group.maxAge !== "") {
        if (group.minAge !== undefined && group.minAge !== "") title += "; Age: " + group.minAge + "-" + group.maxAge;
        else title += "; Age: 0-" + group.maxAge;
      }
    }
    return title;
  };
  const groupCfTitle = (group) => {
    let title = "";
    if (group != undefined) {
      if (group.maxFraction !== undefined && group.maxFraction !== "") {
        if (group.minFraction !== undefined && group.minFraction !== "")
          title += "; CF: " + group.minFraction / 100.0 + "-" + group.maxFraction / 100.0;
        else title += "; CF: 0-" + group.maxFraction / 100.0;
      }
    }
    return title;
  };

  const checkTitleStudyPlatForm = (group, title) => {
    //if none of the array value belongs to one study, then in the title, the study name should be removed
    //and give a notes for this study
    let errorMessage = "";
    // console.log(group.approach);
    group.study !== undefined &&
      group.approach !== undefined &&
      group.study.forEach((s) => {
        console.log(s.value, group.approach.length);
        if (s.value === "plco" && group.approach.length > 0) {
          const plcoArray = group.approach.filter((a) => a.value === "gsa" || a.value === "oncoArray");
          console.log(plcoArray);
          if (plcoArray.length === 0) {
            title = title.replace("PLCO,", "").replace("PLCO", "");
            errorMessage = "Note: PLCO does not contain " + group.approach.map((obj) => obj.label);
          }
        }
        if (s.value === "ukbb" && group.approach.length > 0) {
          const ukArray = group.approach.filter((a) => a.value === "Axiom" || a.value === "BiLEVE");
          if (ukArray.length === 0) {
            title = title.replace("UK Biobank,", "").replace("UK Biobank", "");
            errorMessage = "Note: UKBB does not contain " + group.approach.map((obj) => obj.label);
          }
        }
      });
    console.log(group.approach, errorMessage, title);
    return [title, errorMessage];
  };

  useEffect(() => {
    setCircosTitle(
      singleTitle({
        types: form.types,
        sex: form.sex,
        study: form.study,
        ancestry: form.ancestry,
        approach: form.approach,
        smoking: form.smoking,
        maxAge: form.maxAge,
        minAge: form.minAge,
        maxFraction: form.maxFraction,
        minFraction: form.minFraction,
      })
    );
  }, [form.counterSubmitted]);

  const handleDownload = () => {
    setIsLoaded(true);
    var imageAs = document.getElementById("A");
    var imageA = imageAs.querySelectorAll("svg")[0];
    var imageBs = document.getElementById("B");
    var imageB = imageBs.querySelectorAll("svg")[0];
    //initial
    var imagesnp = imageAs.querySelectorAll("svg")[1];
    var imagegene = imageAs.querySelectorAll("svg")[1];

    var snp = document.getElementById("snpplots");
    // if (snp !== null) imagesnp = snp.querySelectorAll("svg")[0];
    if (snp !== null) {
      if (snp.querySelectorAll("svg")[0] !== undefined) imagesnp = snp;
    }
    var gene = document.getElementById("geneplots");
    // if (gene !== null) imagegene = gene.querySelectorAll("svg")[0];
    if (gene !== null) {
      if (gene.querySelectorAll("svg")[0] !== undefined) imagegene = gene;
    }

    //  htmlToImage
    //    .toPng(imageall, { quality: 1, pixelRatio: 1 })
    //    .then(function (dataUrl) {
    //      const blob = dataURLtoBlob(dataUrl);
    //      saveAs(blob, "summaryChromosome.png");
    //    })
    //    .catch(function (error) {
    //      console.error("oops, something went wrong on png!", error);
    //    });

    const initalY = 15;
    const legendSize = 2;
    const legendY = 5;
    const legendY2 = 7;
    const legendX = 150;
    let figResolution = 0.8;
    let downloadname = "compareSummary.pdf";
    if (chromesomeId) {
      figResolution = 1;
      downloadname = rangeLabel ? rangeLabel : "Chr" + chromesomeId + ".pdf";
    }

    htmlToImage
      .toPng(imageA, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
      .then((dataUrl1) => {
        htmlToImage
          .toPng(imageB, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
          .then((dataUrl2) => {
            htmlToImage
              .toPng(imagesnp, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
              .then((dataUrl3) => {
                htmlToImage
                  .toPng(imagegene, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
                  .then((dataUrl4) => {
                    const pdf = new jsPDF();
                    const width = pdf.internal.pageSize.getWidth() / 2;
                    pdf.setFillColor(0, 128, 0);
                    pdf.rect(legendX, legendY, legendSize, legendSize, "F");
                    pdf.setFontSize(8);
                    pdf.setTextColor(0, 128, 0);
                    pdf.text("Gain", legendX + 3, legendY2);

                    pdf.setFillColor(0, 0, 255);
                    pdf.rect(legendX + 10, legendY, legendSize, legendSize, "F");
                    pdf.setTextColor(0, 0, 255);
                    pdf.text("Neutral", legendX + 13, legendY2);

                    pdf.setFillColor(255, 0, 0);
                    pdf.rect(legendX + 24, legendY, legendSize, legendSize, "F");
                    pdf.setTextColor(255, 0, 0);
                    pdf.text("Loss", legendX + 27, legendY2);

                    pdf.setFillColor(128, 128, 128);
                    pdf.rect(legendX + 34, legendY, legendSize, legendSize, "F");
                    pdf.setTextColor(128, 128, 128);
                    pdf.text("Undetermined", legendX + 37, legendY2);

                    pdf.setTextColor(0, 0, 0);
                    pdf.setFontSize(8);
                    if (chromesomeId) pdf.text("Chromosome " + chromesomeId, width, initalY, { align: "center" });
                    pdf.text(commonTitle, width, initalY + 4, { align: "center" });
                    pdf.text(titleA, width * 0.5, initalY + 8, { align: "center" });
                    pdf.text(titleB, 1.5 * width, initalY + 8, { align: "center" });

                    pdf.addImage(dataUrl1, "PNG", 0, initalY + 10, width, width);
                    pdf.addImage(dataUrl2, "PNG", width, initalY + 10, width, width);

                    pdf.addImage(dataUrl3, "PNG", 0, width + initalY + 20, width, 0);
                    pdf.addImage(dataUrl3, "PNG", width, width + initalY + 20, width, 0);
                    pdf.addImage(dataUrl4, "PNG", 0, width + initalY + 40, width, 0);
                    pdf.addImage(dataUrl4, "PNG", width, width + initalY + 40, width, 0);

                    if (chromesomeId) pdf.text(rangeLabel, width * 0.5, width + 30, { align: "center" });
                    if (chromesomeId) pdf.text(rangeLabel, width * 1.5, width + 30, { align: "center" });
                    //}

                    pdf.save(downloadname);
                    //setTimeout(() => pdf.save(downloadname), 500);
                    setIsLoaded(false);
                    //const blob = dataURLtoBlob(dataUrl4);
                    //saveAs(blob, "gene.png");
                  });
              });
          });
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handlecircleDownload = () => {
    setIsLoaded(true);
    var imageAs = document.getElementById("A");
    var imageA = imageAs.querySelectorAll("svg")[0];
    var imageBs = document.getElementById("B");
    var imageB = imageBs.querySelectorAll("svg")[0];
    //initial

    const initalY = 15;
    const legendSize = 2;
    const legendY = 5;
    const legendY2 = 7;
    const legendX = 150;
    let figResolution = 1;
    let downloadname = "compareSummary.pdf";

    htmlToImage
      .toPng(imageA, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
      .then((dataUrl1) => {
        htmlToImage
          .toPng(imageB, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
          .then((dataUrl2) => {
            const pdf = new jsPDF();
            const width = pdf.internal.pageSize.getWidth() / 2;
            pdf.setFillColor(0, 128, 0);
            pdf.rect(legendX, legendY, legendSize, legendSize, "F");
            pdf.setFontSize(8);
            pdf.setTextColor(0, 128, 0);
            pdf.text("Gain", legendX + 3, legendY2);

            pdf.setFillColor(0, 0, 255);
            pdf.rect(legendX + 10, legendY, legendSize, legendSize, "F");
            pdf.setTextColor(0, 0, 255);
            pdf.text("Neutral", legendX + 13, legendY2);

            pdf.setFillColor(255, 0, 0);
            pdf.rect(legendX + 24, legendY, legendSize, legendSize, "F");
            pdf.setTextColor(255, 0, 0);
            pdf.text("Loss", legendX + 27, legendY2);

            pdf.setFillColor(128, 128, 128);
            pdf.rect(legendX + 34, legendY, legendSize, legendSize, "F");
            pdf.setTextColor(128, 128, 128);
            pdf.text("Undetermined", legendX + 37, legendY2);

            pdf.setTextColor(0, 0, 0);
            pdf.setFontSize(8);
            // if (chromesomeId) pdf.text("Chromosome " + chromesomeId, width, initalY, { align: "center" });
            pdf.text(commonTitle.slice(1), width, initalY, { align: "center" });
            pdf.text(titleA, width * 0.5, initalY + 5, { align: "center" });
            pdf.text(titleB, 1.5 * width, initalY + 5, { align: "center" });

            pdf.addImage(dataUrl1, "PNG", 0, initalY + 10, width, width);
            pdf.addImage(dataUrl2, "PNG", width, initalY + 10, width, width);

            //if (chromesomeId) pdf.text(rangeLabel, width * 0.5, width + 30, { align: "center" });
            // if (chromesomeId) pdf.text(rangeLabel, width * 1.5, width + 30, { align: "center" });
            //}

            pdf.save(downloadname);
            //setTimeout(() => pdf.save(downloadname), 500);
            setIsLoaded(false);
            //const blob = dataURLtoBlob(dataUrl4);
            //saveAs(blob, "gene.png");
          });
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const dataURLtoBlob = (dataUrl) => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };
  const handleSummaryDownload = async () => {
    setIsLoaded(true);
    var images = document.getElementById("summaryCircle");
    var image = images.querySelectorAll("svg")[1];
    var imageXY = images.querySelectorAll("svg")[0];
    const imgconfig = {
      quality: 1,
      pixelRatio: 1,
    };
    // const canvas = await htmlToImage.toCanvas(image);
    // const base64fDataUrl = canvas.toDataURL("image/png");
    // const canvasxy = await htmlToImage.toCanvas(imageXY);
    // const base64fDataUrlxy = canvas.toDataURL("image/png");
    // console.log(base64fDataUrl);
    htmlToImage
      .toPng(image, imgconfig)
      .then((dataUrl) => {
        htmlToImage.toPng(imageXY, imgconfig).then((dataUrl2) => {
          const pdf = new jsPDF();
          const width = pdf.internal.pageSize.getWidth();
          //const height = pdf.internal.pageSize.getHeight();
          //pdf.text("", width *0.5, 10, { align: "center" });
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(12);
          pdf.text(circosTitle.slice(1), width * 0.5, 15, { align: "center" });

          pdf.addImage(dataUrl, "PNG", 0, 20, width, width);
          pdf.addImage(dataUrl2, "PNG", 0, 20, width, width);
          pdf.save(circosTitle.slice(1) + ".pdf");
          setIsLoaded(false);
        });
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handleSingleChrDownload = () => {
    setIsLoaded(true);
    var image = document.getElementById("One");
    var imageA = image.querySelectorAll("svg")[0];
    var snp = document.getElementById("snpplots");
    var imagesnp = image.querySelectorAll("svg")[1];
    // if (snp !== null) imagesnp = snp.querySelectorAll("svg")[0];
    if (snp !== null) imagesnp = snp;

    var gene = document.getElementById("geneplots");
    var imagegene = image.querySelectorAll("svg")[1]; //set an intial value
    //if (gene !== null) imagegene = gene.querySelectorAll("svg")[0];
    if (gene !== null) {
      if (gene.querySelectorAll("svg")[0] !== undefined) imagegene = gene;
    }
    const initalY = 15;
    const legendSize = 2;
    const legendY = 5;
    const legendY2 = 7;
    const legendX = 150;
    let figResolution = 0.8;
    let downloadname = "Chr" + chromesomeId + ".pdf";
    if (chromesomeId) {
      figResolution = 1;
      downloadname = rangeLabel ? rangeLabel : "Chr" + chromesomeId + ".pdf";
    }

    htmlToImage
      .toPng(imageA, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
      .then((dataUrl1) => {
        htmlToImage
          .toPng(imagesnp, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
          .then((dataUrl3) => {
            htmlToImage
              .toPng(imagegene, { quality: figResolution, pixelRatio: figResolution, backgroundColor: "white" })
              .then((dataUrl4) => {
                const pdf = new jsPDF();
                const width = pdf.internal.pageSize.getWidth();
                pdf.setFillColor(0, 128, 0);
                pdf.rect(legendX, legendY, legendSize, legendSize, "F");
                pdf.setFontSize(8);
                pdf.setTextColor(0, 128, 0);
                pdf.text("Gain", legendX + 3, legendY2);

                pdf.setFillColor(0, 0, 255);
                pdf.rect(legendX + 10, legendY, legendSize, legendSize, "F");
                pdf.setTextColor(0, 0, 255);
                pdf.text("Neutral", legendX + 13, legendY2);

                pdf.setFillColor(255, 0, 0);
                pdf.rect(legendX + 24, legendY, legendSize, legendSize, "F");
                pdf.setTextColor(255, 0, 0);
                pdf.text("Loss", legendX + 27, legendY2);

                pdf.setFillColor(128, 128, 128);
                pdf.rect(legendX + 34, legendY, legendSize, legendSize, "F");
                pdf.setTextColor(128, 128, 128);
                pdf.text("Undetermined", legendX + 37, legendY2);

                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(8);
                if (chromesomeId) pdf.text("Chromosome " + chromesomeId, width * 0.5, initalY, { align: "center" });
                pdf.text(circosTitle.slice(1), width * 0.5, initalY + 5, { align: "center" });

                pdf.addImage(dataUrl1, "PNG", 0.25 * width, initalY + 10, width / 2, 0);
                pdf.addImage(dataUrl3, "PNG", 0.25 * width, width * 0.5 + 10, width / 2, 0);
                pdf.addImage(dataUrl4, "PNG", 0.25 * width, width * 0.5 + 20, width / 2, 0);
                pdf.setFontSize(5);
                if (chromesomeId) pdf.text(rangeLabel, width * 0.5, width * 0.5 + 5, { align: "center" });
                //}

                pdf.save(downloadname);
                //setTimeout(() => pdf.save(downloadname), 500);
                setIsLoaded(false);
                //const blob = dataURLtoBlob(dataUrl4);
                //saveAs(blob, "gene.png");
              });
          });
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handleZoomback = () => {
    const zoombackbtnA = document.getElementById("zoomBackA");
    const zoombackbtnB = document.getElementById("zoomBackB");
    const zoombackbtn = document.getElementById("zoomBackOne");
    if (zoombackbtnA !== null) zoombackbtnA.click();

    if (zoombackbtnB !== null) zoombackbtnB.click();
    if (zoombackbtn !== null) zoombackbtn.click();
    //if the last one, click autorange button
  };

  const handleZoomInitial = () => {
    //setIsinit(true);
    const resetBtnA = document.querySelectorAll('#A a[data-val*="auto"]')[0];
    const resetBtnB = document.querySelectorAll('#B a[data-val*="auto"]')[0];
    const resetBtnOne = document.querySelectorAll('#One a[data-val*="auto"]')[0];
    if (resetBtnA !== undefined) resetBtnA.click();
    if (resetBtnB !== undefined) resetBtnB.click();
    if (resetBtnOne !== undefined) resetBtnOne.click();
  };

  const handleZoomHistory = (zoomHistory) => {
    if (zoomHistory.length == 2) {
      setZoomRange(zoomHistory[0]);
      setRangeLabel(zoomHistory[1]);
      //update tableData based on zoom range
      //console.log(tableData);
    }
  };
  useEffect(() => {
    //console.log("showChart: ", showChart, isCompare);
    const handleResize = () => {
      // window.innerWidth < 700;
      const summarybtn = document.getElementById("summarySubmit");
      //console.log(window.innerWidth, size, singleFigWidth);
      //console.log("showChart: ", showChartRef.current, compareRef.current);
      if (!compareRef.current) {
        if (!showChartRef.current) {
          if (window.innerWidth < 1200 && size > 850) {
            summarybtn.click();
          } else if (window.innerWidth < 980 && size > 600) {
            summarybtn.click();
          } else if (window.innerWidth > 980 && size < 700) {
            summarybtn.click();
          }
        } else {
          singleChromeSize = window.innerWidth * 0.8;
        }
      } else {
        if (!showChartRef.current) {
          if (window.innerWidth < 600) {
            // console.log(window.innerWidth, singleFigWidth);
            const comparebtn = document.getElementById("compareSubmit");
            comparebtn.click();
          }
        }
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [window.innerWidth]);

  //console.log(data,dataCompared)
  //only disply 200 events for X and Y
  const dataXY = [...props.chrx.slice(0, 200), ...props.chry.slice(0, 200)];
  //console.log("gain:",props.gain.length,"loh:",props.loh.length,
  //"loss:",props.loss.length,"under:",props.undetermined.length)
  const linethickness = 0;
  const thicknessgain = props.gain.length < 1000 ? 0 : linethickness;
  const thicknessloh = props.loh.length < 1000 ? 0 : linethickness;
  const thicknessloss = props.loss.length < 1000 ? 0 : linethickness;
  const thicknessundermined = props.undetermined.length < 1000 ? 0 : linethickness;

  let layoutAll = !form.chrX || form.chrX === undefined ? layout.filter((l) => l.label !== "X") : layout;
  layoutAll = !form.chrY || form.chrY === undefined ? layoutAll.filter((l) => l.label !== "Y") : layoutAll;

  let layout_xy = !form.chrX || form.chrX === undefined ? layoutxy.filter((l) => l.label !== "X") : layoutxy;
  layout_xy = !form.chrY || form.chrY === undefined ? layout_xy.filter((l) => l.label !== "Y") : layout_xy;

  singleFigWidth = form.compare ? size * 0.45 : size;
  singleFigWidth = singleFigWidth < minFigSize ? minFigSize - 100 : singleFigWidth;
  //set tableData based on status
  //if compare, and no chromoid => add circleA and circleB
  //if compare with chromoid => add groupA and groupB
  //if not compare, no chromoid => add circle
  //if not compare, with chromid => add data

  useEffect(() => {
    if (circleA !== null) {
      setCircleTableData([
        ...circleA.loss,
        ...circleA.gain,
        ...circleA.loh,
        ...circleA.undetermined,
        ...circleA.chrx,
        ...circleA.chry,
        ...circleTableData,
      ]);
      // setTableData([
      //   ...circleA.loss,
      //   ...circleA.gain,
      //   ...circleA.loh,
      //   ...circleA.undetermined,
      //   ...circleA.chrx,
      //   ...circleA.chry,
      //   ...tableData,
      // ]);
    } else setTableData([]);
    // props.getData(circleTableData);
  }, [circleA, form.plotType]);
  useEffect(() => {
    if (circleB !== null) {
      setCircleTableData([
        ...circleB.loss,
        ...circleB.gain,
        ...circleB.loh,
        ...circleB.undetermined,
        ...circleB.chrx,
        ...circleB.chry,
        ...circleTableData,
      ]);
      // setTableData([
      //   ...circleB.loss,
      //   ...circleB.gain,
      //   ...circleB.loh,
      //   ...circleB.undetermined,
      //   ...circleB.chrx,
      //   ...circleB.chry,
      //   ...tableData,
      // ]);
    } else {
      tableRef.current = [];
      //console.log(tableRef.current, circleB);
    }
    // props.getData(circleTableData);
  }, [circleB, form.plotType]);

  useEffect(() => {
    if (groupA !== null || groupB !== null) {
      setTableData([...groupA, ...groupB]);
      //setFisherB(fisherTest(groupB.length, 5, 3, 12));
    }
    //set tableData within range
    props.getData(tableData);
  }, [groupA, groupB, rangeLabel]);

  useEffect(() => {
    if (form.plotType.value === "circos") {
      //console.log("whole chromosome", circleTableData);
      props.getData(circleTableData);
    } else {
      if (rangeLabel.length > 0) {
        let rangeMin = rangeLabel.split("-")[0].split(":")[1].replace(/,/g, "");
        let rangeMax = rangeLabel.split("-")[1].replace(/,/g, "");

        rangeMax = Number(rangeMax);
        rangeMin = Number(rangeMin);
        const zoomedTabledata = data.filter((d) => !(d.start > rangeMax || d.end < rangeMin));
        console.log(zoomedTabledata.length);
        if (!form.compare) props.getData(zoomedTabledata);
      } else {
        props.getData([]);
      }
      if (form.compare) {
        props.getData(tableRef.current);
      }
    }
  }, [tableData, form.plotType, circleTableData, rangeLabel]);
  //props.getData(tableData);

  useEffect(() => {
    if (form.plotType.value === "static" && form.counterCompare > 0) {
      console.log(rangeLabel);
      if (rangeLabel.length > 0) {
        let rangeMin = rangeLabel.split("-")[0].split(":")[1].replace(/,/g, "");
        let rangeMax = rangeLabel.split("-")[1].replace(/,/g, "");

        rangeMax = Number(rangeMax);
        rangeMin = Number(rangeMin);
        //reset tableData and fisher number
        const rangeGroupA = groupA.filter((d) => !(d.start > rangeMax || d.end < rangeMin));
        const rangeGroupB = groupB.filter((d) => !(d.start > rangeMax || d.end < rangeMin));

        setTableData([...rangeGroupA, ...rangeGroupB]);
        setRangeA(rangeGroupA.length);
        setRangeB(rangeGroupB.length);
        // console.log(rangeA.length, rangeB.length);
        handleFisherTest(rangeGroupA.length, fisherA, rangeGroupB.length, fisherB);
      } else handleFisherTest(groupA.length, fisherA, groupB.length, fisherB);
    }
  }, [fisherA, fisherB, groupA.length, groupB.length, rangeLabel]);

  return (
    <Container className="compareContainer align-middle text-center">
      {showChartRef.current ? (
        // <div style={{ height: compareCircleSize + figureHeight + 620, left: 0 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
            {!form.compare ? (
              <Button variant="link" style={{ padding: "2px" }} onClick={handleBack}>
                All chromosomes &#8592;
              </Button>
            ) : (
              <Button variant="link" style={{ padding: "2px " }} onClick={handleCircosCompareBack}>
                Back to circos compare &#8592;
              </Button>
            )}
            {rangeLabel ? (
              <>
                <Button variant="link" style={{ padding: "2px" }} onClick={handleZoomInitial}>
                  Chr{chromesomeId} &#8592;
                </Button>
              </>
            ) : (
              ""
            )}
            <Button variant="link" style={{ padding: "2px" }} onClick={handleZoomback}>
              {zoomRange}
            </Button>
            {zoomRange ? <>&#8592;</> : ""}
          </div>

          {form.compare && form.counterCompare > 0 && (
            <>
              <Row className="align-items-start">
                <Col xs={12} md={3} lg={3} className="d-flex">
                  <Legend></Legend>
                </Col>
                <Col xs={12} md={6} lg={6} style={{ fontSize: "14px" }}>
                  {rangeLabel ? rangeLabel : "Chr" + chromesomeId}
                  <br></br> {commonTitle}
                </Col>
                <Col
                  xs={12}
                  md={3}
                  lg={3}
                  className="d-flex"
                  style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                  {isLoaded ? (
                    <p>Downloading...</p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleDownload}
                      style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                      Download comparison images
                    </Button>
                  )}
                </Col>
              </Row>
              <Row className="">
                <Col xs={12} md={6} lg={6}>
                  <div style={{ position: "sticky", top: 0 }}>
                    <SingleChromosome
                      onZoomChange={handleZoomChange}
                      zoomRange={zoomRangeA}
                      data={groupA}
                      title={titleA}
                      msg={msgA}
                      fisherP={fisherA}
                      details="A"
                      chromesomeId={chromesomeId}
                      width={singleFigWidth}
                      height={singleFigWidth}
                      zoomHistory={handleZoomHistory}
                      //onHeightChange={props.onHeightChange}
                      //onCompareHeightChange={handleCompareHeightChange}
                    ></SingleChromosome>
                  </div>
                </Col>
                <Col xs={12} md={6} lg={6}>
                  <div style={{ position: "sticky", top: 0 }}>
                    <SingleChromosome
                      onZoomChange={handleZoomChange}
                      zoomRange={zoomRangeB}
                      data={groupB}
                      title={titleB}
                      msg={msgB}
                      fisherP={fisherB}
                      details="B"
                      chromesomeId={chromesomeId}
                      width={singleFigWidth}
                      height={singleFigWidth}
                      zoomHistory={handleZoomHistory}
                      //onHeightChange={props.onHeightChange}
                      //onCompareHeightChange={handleCompareHeightChange}
                    ></SingleChromosome>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xs={12} md={3} lg={3}></Col>
                <Col xs={12} md={6} lg={6}>
                  P_Fisher= {Pfisher}
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th></th>
                        <th colSpan="3">mca in region </th>
                      </tr>
                      <tr>
                        <th></th>
                        <th>Yes </th>
                        <th>No </th>
                        <th>Total </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{titleA}</td>
                        <td>{rangeLabel === "" ? groupA.length : rangeA}</td>
                        <td>{fisherA > rangeA ? fisherA - groupA.length : fisherA}</td>
                        <td>{fisherA}</td>
                      </tr>
                      <tr>
                        <td>{titleB}</td>
                        <td>{rangeLabel === "" ? groupB.length : rangeB}</td>
                        <td>{fisherB > rangeB ? fisherB - groupB.length : fisherB}</td>
                        <td>{fisherB}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
          {!form.compare && (
            <>
              <Row className="align-items-start">
                <Col xs={12} md={3} lg={3} className="d-flex" style={{ alignItems: "top" }}>
                  <Legend></Legend>
                </Col>
                <Col xs={12} md={6} lg={6} style={{ fontSize: "14px" }}>
                  {rangeLabel ? rangeLabel : "Chr" + chromesomeId}
                  <br></br>
                  {circosTitle.slice(1)}
                </Col>
                <Col
                  xs={12}
                  md={3}
                  lg={3}
                  className="d-flex"
                  style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                  {isLoaded ? (
                    <p>Downloading...</p>
                  ) : (
                    <Button
                      variant="link"
                      onClick={handleSingleChrDownload}
                      style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                      Download images
                    </Button>
                  )}
                </Col>
              </Row>
              <Row className="">
                <Col lg={12}>
                  <SingleChromosome
                    onZoomChange={handleZoomChange}
                    data={data}
                    details={"One"}
                    title={""}
                    msg={msg}
                    chromesomeId={chromesomeId}
                    size={singleChromeSize}
                    zoomHistory={handleZoomHistory}
                    onHeightChange={props.onHeightChange}></SingleChromosome>
                </Col>
              </Row>
            </>
          )}
        </div>
      ) : form.compare ? (
        // <div style={{ height: 2 * compareCircleSize + 200, left: 0 }}>
        <div>
          <Row className="align-items-start">
            <Col xs={12} md={12} lg={3} className="d-flex" style={{ alignItems: "top" }}>
              <Legend></Legend>
            </Col>
            <Col xs={12} md={12} lg={6} style={{ fontSize: "14px" }}>
              {commonTitle}
            </Col>
            <Col
              xs={12}
              md={12}
              lg={3}
              className="d-flex"
              style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
              {isLoaded ? (
                <p>Downloading...</p>
              ) : circleA ? (
                <Button
                  variant="link"
                  onClick={handlecircleDownload}
                  style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                  Download comparison images
                </Button>
              ) : (
                ""
              )}
            </Col>
          </Row>
          <div>
            <Row className="justify-content-center g-0">
              <Col xs={12} md={6} lg={6} style={{ height: compareCircleSize + 15 }}>
                {circleA ? (
                  <CircosPlotCompare
                    layoutAll={layoutAll}
                    layoutxy={layout_xy}
                    title={titleA}
                    dataXY={[]}
                    details="A"
                    msg={msgA}
                    size={compareCircleSize}
                    thicknessloss={thicknessloss}
                    thicknessgain={thicknessgain}
                    thicknessundermined={thicknessundermined}
                    thicknessloh={thicknessloh}
                    circle={circleA}
                    circleRef={circleRef}
                    //circleClass="overlayX"
                    handleEnter={handleEnter}
                    hovertip={hovertip}></CircosPlotCompare>
                ) : (
                  ""
                )}
              </Col>
              <Col xs={12} md={6} lg={6} style={{ height: compareCircleSize + 15 }}>
                {circleB ? (
                  <CircosPlotCompare
                    layoutAll={layoutAll}
                    layoutxy={layout_xy}
                    dataXY={[]}
                    title={titleB}
                    details="B"
                    size={compareCircleSize}
                    thicknessloss={thicknessloss}
                    thicknessgain={thicknessgain}
                    thicknessundermined={thicknessundermined}
                    thicknessloh={thicknessloh}
                    circle={circleB}
                    circleRef={circleRef}
                    handleEnter={handleEnter}
                    msg={msgB}
                    //circleClass="overlayX"
                    hovertip={hovertip}></CircosPlotCompare>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <div>
          <Row className="align-items-start">
            <Col xs={12} md={12} lg={3} className="d-flex">
              <Legend></Legend>
            </Col>
            <Col xs={12} md={12} lg={6} style={{ justifyContent: "center", fontSize: "14px" }}>
              {circosTitle.slice(1)}
            </Col>
            <Col
              xs={12}
              md={12}
              lg={3}
              className="d-flex"
              style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
              {isLoaded ? (
                <p>Downloading...</p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleSummaryDownload}
                  style={{ justifyContent: "flex-end", paddingTop: 0, border: 0 }}>
                  Download image
                </Button>
              )}
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={12} lg={12} style={{ width: size, height: size + 15 }}>
              <CircosPlot
                layoutAll={layoutAll}
                layoutxy={layout_xy}
                dataXY={dataXY}
                title={""}
                msg={msg}
                size={size}
                thicknessloss={thicknessloss}
                thicknessgain={thicknessgain}
                thicknessundermined={thicknessundermined}
                thicknessloh={thicknessloh}
                circle={circle}
                circleRef={circleRef}
                handleEnter={handleEnter}
                circleClass="overlayX"
                hovertip={hovertip}></CircosPlot>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}
