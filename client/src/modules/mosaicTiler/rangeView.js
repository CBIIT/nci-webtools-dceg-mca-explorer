import { useState, useEffect, useRef, useCallback } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { formState } from "./explore.state";
import Plot from "react-plotly.js";
import { Tabs, Tab, Row, Col, Spinner } from "react-bootstrap";
import { ExcelFile, ExcelSheet } from "../components/excel-export";
import Table from "../components/table";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest";
import { Columns, exportTable } from "./tableColumns";
import { AncestryOptions, smokeNFC, SexOptions } from "./constants";
import { LoadingOverlay } from "../components/controls/loading-overlay/loading-overlay";

const emptyPlotData = {
  gain: [],
  loss: [],
  loh: [],
  undetermined: [],
  chrX: [],
  chrY: [],
  allValues: [],
};

const ancestryLabelByValue = new Map(AncestryOptions.map((item) => [item.value, item.label]));
const smokeLabelByValue = new Map(smokeNFC.map((item) => [item.value, item.label]));
const sexLabelByValue = new Map(SexOptions.map((item) => [item.value, item.label]));

const waitForNextPaint = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

export default function RangeView(props) {
  const [form, setForm] = useRecoilState(formState);
  const [tab, setTab] = useState("summary");
  const [clickedCounter, setClickedCounter] = useState(0);
  //console.log(form);
  const [chromoId, setChromoId] = useState(form.chrSingle ? form.chrSingle.label : -1);
  const [allValue, setAllValue] = useState([]);
  const [browserSize, setBrowserSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const handleBrowserResize = () => {
    setBrowserSize({
      width: window.innerWidth,
      height: window.innerHeight * 0.7,
    });
  };
  // useEffect(() => {
  //   window.addEventListener("resize", handleBrowserResize);
  //   console.log("resizing...", browserSize);
  //   return () => {
  //     window.removeEventListener("resize", handleBrowserResize);
  //   };
  // }, []);
  const chartHeight = browserSize.height;
  //console.log(form.study.length)

  const [figureHeight, setFigureHeight] = useState(chartHeight);

  const [plotData, setPlotData] = useState(emptyPlotData);
  const [tableData, setTableData] = useState([]); //for compare data
  const [loaded, setLoaded] = useState(false);
  const [allDenominator, setAllDenominator] = useState(0);
  const [violinData, setViolinData] = useState([]);
  const circleRef = useRef(null);
  const latestQueryTimingRef = useRef(null);
  const queryInFlightRef = useRef(false);

  const study_value = form.study;
  let query_value = [];
  Array.isArray(study_value)
    ? (query_value = [...study_value, form.chrX ? { value: "X" } : "", form.chrY ? { value: "Y" } : ""])
    : (query_value = [study_value, form.chrX ? { value: "X" } : "", form.chrY ? { value: "Y" } : ""]);

  //console.log("review:", form);
  useEffect(() => {
    // console.log(form);
    if (form.submitted) {
      handleSubmit(query_value, form);
    } else {
    }
  }, [
    form.counterSubmitted,
    //form.study,form.types,form.chrX,form.chrY,form.submitted,form.chromosome,
    // form.sex,form.approach,form.maxAge,form.minAge,form.maxFraction,form.minFraction,
    // form.ancestry,form.algorithm
  ]);

  async function handleSubmit(qdataset, qform) {
    const totalStartMs = performance.now();
    const timing = {
      route: "rangeView",
      previousBaselineMs: {
        originalApprox: 120000,
        preMergedApiExample: 9674,
      },
    };
    queryInFlightRef.current = true;
    setPlotData(emptyPlotData);
    setLoaded(false);
    await waitForNextPaint();
    // setForm({ ...form, chrX: false, chrY: false });
    //setLoading(true)
    console.log(qform);
    const query = {
      study: qdataset,
      sex: qform.sex,
      mincf: qform.minFraction,
      maxcf: qform.maxFraction,
      ancestry: qform.ancestry,
      types: qform.types,
      chromosomes: qform.plotType.value === "static" ? qform.chrSingle : null,
      start: qform.plotType.value === "circos" ? "" : qform.start,
      end: qform.plotType.value === "circos" ? "" : qform.end,
      array: qform.approach,
      minAge: qform.minAge,
      maxAge: qform.maxAge,
      smoking: qform.smoking,
      priorCancer: qform.priorCancer,
      hemaCancer: qform.hemaCancer,
      lymCancer: qform.lymCancer,
      myeCancer: qform.myeCancer,
    };

    const apiStartMs = performance.now();
    const mcaStartMs = performance.now();
    const mcaRequest = axios.post("api/opensearch/mca", query).finally(() => {
      timing.mcaApiMs = Math.round(performance.now() - mcaStartMs);
    });
    const denominatorStartMs = performance.now();
    const denominatorRequest = axios.post("api/opensearch/denominator", query).finally(() => {
      timing.denominatorApiMs = Math.round(performance.now() - denominatorStartMs);
    });
    const [response, allresponseDenominator] = await Promise.all([mcaRequest, denominatorRequest]);
    timing.apiMs = Math.round(performance.now() - apiStartMs);

    const transformStartMs = performance.now();
    const nextPlotData = {
      gain: [],
      loss: [],
      loh: [],
      undetermined: [],
      chrX: [],
      chrY: [],
      allValues: [],
    };
    const allBuckets = {
      gain: [],
      loss: [],
      loh: [],
      undetermined: [],
    };
    //console.log(response.data.denominator.length, allresponseDenominator.data);
    setAllDenominator(allresponseDenominator.data);
    const mergedResult = Array.isArray(response.data.merged)
      ? response.data.merged
      : (() => {
          let results = null;
          let responseDenominator = null;
          if (
            //if any attribute filer is selected, then use the value as the filter, that means filter out no value
            qform.smoking.length === 0 &&
            qform.approach.length === 0 &&
            (qform.ancestry[0] === undefined || (qform.ancestry[0] !== undefined && qform.ancestry[0].value === "all")) &&
            (qform.sex[0] === undefined || (qform.sex[0] !== undefined && qform.sex[0].value === "all")) &&
            qform.minAge === "" &&
            qform.maxAge === "" &&
            qform.priorCancer.length === 0 &&
            qform.hemaCancer.length === 0 &&
            qform.lymCancer.length === 0 &&
            qform.myeCancer.length === 0
          ) {
            results = response.data.denominator || [];
            responseDenominator = response.data.nominator || [];
          } else {
            results = response.data.nominator || [];
            responseDenominator = response.data.denominator || [];
          }

          const resultBySampleId = new Map();
          results.forEach((item) => {
            const sampleId = item?._source?.sampleId;
            if (sampleId !== undefined && !resultBySampleId.has(sampleId)) {
              resultBySampleId.set(sampleId, item._source);
            }
          });

          return responseDenominator.map((itemA) => {
            const sampleId = itemA?._source?.sampleId;
            const nominatorSource = sampleId !== undefined ? resultBySampleId.get(sampleId) : undefined;
            if (nominatorSource !== undefined)
              return {
                ...itemA._source,
                ...nominatorSource,
              };
            else
              return {
                ...itemA._source,
              };
          });
        })();
    timing.responseShape = Array.isArray(response.data.merged) ? "merged" : "legacy";
    timing.mergedRows = mergedResult.length;
    timing.allDenominator = allresponseDenominator.data;
    //console.log(mergedResult.length);
    // const denominatorMap = new Map(responseDenominator.map((item) => [item._source.sampleId, item._source]));
    // console.log(form);
    mergedResult.forEach((r) => {
      //if (r._source !== null) {
      if (r.cf != "nan") {
        const d = { ...r };
        d.block_id = d.chromosome.substring(3);
        d.value = d.cf === "NA" ? "" : d.cf;
        d.dataset = d.dataset.toUpperCase();
        d.start = d.beginGrch38;
        d.end = d.endGrch38;
        if (d.PopID !== undefined) {
          d.PopID = ancestryLabelByValue.get(d.PopID) || "";
        }
        if (d.smokeNFC !== undefined) {
          d.smokeNFC = smokeLabelByValue.get(d.smokeNFC) || "NA";
        }
        if (d.sex !== undefined) {
          d.sex = sexLabelByValue.get(d.sex) || "NA";
        }

        //d.sex = d.sex === 0?"F":"M"
        //console.log(d)
        if (d.chromosome != "chrX") {
          if (d.type === "Gain") allBuckets.gain.push(d);
          else if (d.type === "CN-LOH") allBuckets.loh.push(d);
          else if (d.type === "Loss") allBuckets.loss.push(d);
          else if (d.type === "Undetermined") allBuckets.undetermined.push(d);
        }
        //for whole, and select X or Y
        else {
          if (d.type === "mLOX") {
            d.block_id = "X";
            nextPlotData.chrX.push(d);
            //lossTemp.push(d);
          }
          if (d.type === "mLOY") {
            d.block_id = "Y";
            nextPlotData.chrY.push(d);
            //lossTemp.push(d);
          }
        }
      }
      //}
    });
    if (form.types.find((e) => e.value === "all")) {
      nextPlotData.gain = allBuckets.gain;
      nextPlotData.loss = allBuckets.loss;
      nextPlotData.loh = allBuckets.loh;
      nextPlotData.undetermined = allBuckets.undetermined;
    } else {
      if (form.types.find((e) => e.value === "gain")) nextPlotData.gain = allBuckets.gain;
      if (form.types.find((e) => e.value === "loss")) nextPlotData.loss = allBuckets.loss;
      if (form.types.find((e) => e.value === "loh")) nextPlotData.loh = allBuckets.loh;
      if (form.types.find((e) => e.value === "undetermined")) nextPlotData.undetermined = allBuckets.undetermined;
    }
    nextPlotData.allValues = nextPlotData.gain
      .concat(nextPlotData.loss)
      .concat(nextPlotData.loh)
      .concat(nextPlotData.undetermined)
      .concat(nextPlotData.chrX)
      .concat(nextPlotData.chrY);
    console.log(nextPlotData.gain.length);
    timing.transformMs = Math.round(performance.now() - transformStartMs);
    const stateStartMs = performance.now();
    queryInFlightRef.current = false;
    setPlotData(nextPlotData);
    setLoaded(nextPlotData.allValues.length === 0);
    timing.stateQueueMs = Math.round(performance.now() - stateStartMs);
    timing.totalMs = Math.round(performance.now() - totalStartMs);
    timing.improvementVsOriginalApprox = `${(timing.previousBaselineMs.originalApprox / Math.max(timing.totalMs, 1)).toFixed(1)}x faster`;
    timing.improvementVsPreMergedApiExample = `${(timing.previousBaselineMs.preMergedApiExample / Math.max(timing.apiMs, 1)).toFixed(1)}x API faster`;
    latestQueryTimingRef.current = timing;
    console.log(`[rangeView timing summary]\n${JSON.stringify(timing, null, 2)}`);
    console.table({ rangeViewTiming: timing });
  }

  useEffect(() => {
    setClickedCounter(clickedCounter + 1);
    //console.log(chrX);
    if (form.plotType.value === "static") {
      setAllValue(plotData.allValues);
    }
    handleDataChange(plotData.allValues);
  }, [plotData]);

  //const chromosomes = form.chromosome.map((e) => e.label);
  //const chromosomes = form.chromosome;
  // const sortGain = gain
  //   .filter((e) => chromosomes.includes(Number(e.block_id)))
  //   .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  // const sortLoss = loss
  //   .filter((e) => chromosomes.includes(Number(e.block_id)))
  //   .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  // const sortLoh = loh
  //   .filter((e) => chromosomes.includes(Number(e.block_id)))
  //   .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  // const sortUndetermined = undetermined
  //   .filter((e) => chromosomes.includes(Number(e.block_id)))
  //   .sort((a, b) => Number(a.block_id) - Number(b.block_id));

  // const sortX = chrX.filter((e) => chromosomes.includes("X")).sort((a, b) => Number(a.block_id) - Number(b.block_id));
  // const sortY = chrY.filter((e) => chromosomes.includes("Y")).sort((a, b) => Number(a.block_id) - Number(b.block_id));
  // const allValues = sortGain.concat(sortLoss).concat(sortLoh).concat(sortUndetermined).concat(sortX).concat(sortY);
  const { gain, loss, loh, undetermined, chrX, chrY, allValues } = plotData;
  //console.log(gain, sortGain, chromosomes);
  useEffect(() => {
    var chromoIdString = chromoId + "";
    const clickedValues = allValues.filter((v) => v.block_id === chromoIdString);
    console.log(allValues, chromoId, clickedValues);
    setAllValue([...clickedValues]);
    //this is for single chromosome
  }, [chromoId]);

  const columns = Columns;

  function filterDataByType(data, type, defaultValue) {
    if (Array.isArray(data) && data.length > 0) {
      return data.filter((item) => item.type === type);
    }
    return defaultValue;
  }

  function getViolinData(data) {
    // var data = [
    //   {
    //     type: "violin",
    //     y: [1, 2, 3, 4, 5],

    //     box: {
    //       visible: true,
    //     },
    //     boxpoints: false,
    //     line: {
    //       color: "black",
    //     },
    //     fillcolor: "#8dd3c7",
    //     opacity: 0.6,
    //     meanline: {
    //       visible: true,
    //     },
    //   },
    // ];
    // gain.sort((a, b) => Number(a.block_id) - Number(b.block_id));
    // console.log(data);

    var selectedChromeID = chromoId + "";
    var violinGain = filterDataByType(data, "Gain", gain);
    var violinloh = filterDataByType(data, "CN-LOH", loh);
    var violinloss = filterDataByType(data, "Loss", loss.concat(chrX).concat(chrY));
    var violinundeter = filterDataByType(data, "Undetermined", undetermined);

    if (chromoId === "X" || chromoId === "Y") {
      violinGain = [];
      violinloh = [];
      violinundeter = [];
      violinloss = chrX.concat(chrY);
    }

    var violinDataSource = [
      {
        y: violinGain
          .filter((o) => {
            return chromoId > 0 ? o.block_id === selectedChromeID : o;
          })
          .map((e) => {
            return Number(e.value);
          }),
        name: "Gain",
        type: "violin",
        hoverinfo: "none",
        hoveron: "kde",
        bandwidth: 0,
        // hovertemplate: "%{y} <extra></extra>",

        // span: [0, Math.max(...violinGain)],
        //spanmode: "manual",

        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "black",
        },
        fillcolor: "green",
        opacity: 0.6,
        meanline: {
          visible: true,
        },
      },
      {
        y: violinloh
          .filter((o) => {
            return chromoId > 0 ? o.block_id === selectedChromeID : o;
          })
          .map((e) => {
            return Number(e.value);
          }),
        name: "CN-LOH",
        type: "violin",
        hoverinfo: "none",
        hoveron: "point+kde",
        bandwidth: 0,
        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "black",
        },
        fillcolor: "blue",
        opacity: 0.6,
        meanline: {
          visible: true,
        },
      },
      {
        y: violinloss
          .filter((o) => {
            return chromoId > 0 ? o.block_id === selectedChromeID : o;
          })
          .map((e) => {
            return Number(e.value);
          }),
        name: "Loss",
        type: "violin",
        hoverinfo: "none",
        hoveron: "point+kde",
        bandwidth: 0,
        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "black",
        },
        fillcolor: "red",
        opacity: 0.6,
        meanline: {
          visible: true,
        },
      },

      {
        y: violinundeter
          .filter((o) => {
            return chromoId > 0 ? o.block_id === selectedChromeID : o;
          })
          .map((e) => {
            return Number(e.value);
          }),
        name: "Undetermined",
        type: "violin",
        hoverinfo: "none",
        hoveron: "point+kde",
        bandwidth: 0,
        box: {
          visible: true,
        },
        boxpoints: false,
        line: {
          color: "black",
        },
        fillcolor: "grey",
        opacity: 0.6,
        meanline: {
          visible: true,
        },
      },
    ];
    console.log(violinData);
    setViolinData(violinDataSource);
    return violinData;
  }

  function getScatterData() {
    gain.sort((a, b) => Number(a.block_id) - Number(b.block_id));
    const gainScatter = {
      x: gain.map((e) => {
        return Number(e.block_id);
      }),
      y: gain.map((e) => {
        return Number(e.value);
      }),
      name: "Gain",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(26,150,46)",
      },
      hovertext: gain.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const lossScatter = {
      x: loss.map((e) => {
        return Number(e.block_id);
      }),
      y: loss.map((e) => {
        return Number(e.value);
      }),
      name: "Loss",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(255,0,0)",
      },
      hovertext: loss.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const lohScatter = {
      x: loh.map((e) => {
        return Number(e.block_id);
      }),
      y: loh.map((e) => {
        return Number(e.value);
      }),
      name: "LOH",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(31,119,180)",
      },
      hovertext: loh.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const undeterminedScatter = {
      x: undetermined.map((e) => {
        return Number(e.block_id);
      }),
      y: undetermined.map((e) => {
        return Number(e.value);
      }),
      name: "Undetermined",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(77,77,77)",
      },
      hovertext: undetermined.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    return [gainScatter, lossScatter, lohScatter, undeterminedScatter];
  }

  const defaultConfig = {
    displayModeBar: true,
    toImageButtonOptions: {
      format: "svg",
      filename: "plot_export",
      height: 1000,
      width: 1000,
      scale: 1,
    },
    displaylogo: false,
    modeBarButtonsToRemove: ["select2d", "lasso2d", "hoverCompareCartesian", "hoverClosestCartesian"],
  };

  const handleClickedChromoId = (id) => {
    setChromoId(id);
    //const response = await axios.post("api/opensearch/chromosome", { search: [...query_value,{chr:id}] })
  };
  const handleheightChange = (newHeight) => {
    setFigureHeight(newHeight + chartHeight);
  };
  const resetHeight = () => {
    setFigureHeight(chartHeight);
  };
  const handleClickChr = (value) => {
    props.handleClick(value);
    // console.log("in rangeView to click", value);
  };
  //get data by different filters and render in the table
  const handleDataChange = (data) => {
    const handoffTiming = latestQueryTimingRef.current;
    console.log(`[rangeView table handoff]\n${JSON.stringify({
      rows: data.length,
      queryTotalMs: handoffTiming?.totalMs,
      apiMs: handoffTiming?.apiMs,
      responseShape: handoffTiming?.responseShape,
    }, null, 2)}`);
    setTableData(data);
    getViolinData(data);
  };
  const handleCheckboxChange = () => {
    props.onPair();
  };

  const handleSetLoading = useCallback((val) => {
    if (queryInFlightRef.current && val) return;
    setLoaded(val);
  }, []);
  const checkMaxLines = () => {
    let totalLines = 0;
    const linesSummary = {};
    const cellLabels = ["Undetermined", "Loss", "CN-LOH", "Gain"];
    // console.log(circleRef.current,document.getElementById('circosTable').rows.length)
    if (circleRef.current && loaded && document.getElementById("circosTable").getElementsByTagName("tr").length === 0) {
      [".track-0", ".track-1", ".track-2", ".track-3"].forEach((trackClass, index) => {
        const track = document.querySelectorAll(`${trackClass}` + " .block");
        // console.log(track.length);
        const chromosomes = [].concat(
          Array.from({ length: 22 }, (_, i) => i + 1).map((i) => {
            return { key: i, outBlock: 0, all: "" };
          })
        );
        if (track.length > 0) {
          track.forEach((t) => {
            const paths = t.getElementsByTagName("path");
            let counterL = {};
            const radius = paths[0].getAttribute("d");
            const rvalue = radius.match(/A\s*(-?\d+\.?\d*)/);
            const maxR = rvalue !== null ? rvalue[1] : 0;
            for (const path of paths) {
              const dAttribute = path.getAttribute("d");
              //  console.log(dAttribute)
              const dtemp = dAttribute.match(/A\s*(-?\d+\.?\d*)/);
              if (dtemp !== null && dtemp.length > 0) {
                const Avalue = dtemp[1];
                if (Avalue === maxR) counterL[maxR] = (counterL[maxR] || 0) + 1;
              }
            }

            const counterNotL = Object.values(counterL).filter((c) => c > 1);
            //totalLines += paths.length;
            //console.log(paths.length)
            //console.log(t.__data__,counterNotL,paths.length)
            var oline = chromosomes.find((o) => o.key === Number(t.__data__.key));
            if (oline) {
              oline.outBlock = counterNotL[0] ? counterNotL[0] - 1 : 0;
              oline.all = paths.length - 2;
            }
          });
          linesSummary[index] = chromosomes;
        } else linesSummary[index] = [];
      });
      const fourTracks = 4;
      //create table:

      const tableLines = document.createElement("table");
      tableLines.style.border = "1";
      //tableLines.style.tableLayout = "auto"
      tableLines.className = "table table-striped table-hover";

      var header = tableLines.createTHead();
      var hearderRow = header.insertRow(0);
      var hearderCelllabel = document.createElement("th");
      hearderCelllabel.innerHTML = "Chromosome";
      hearderRow.appendChild(hearderCelllabel);
      hearderCelllabel.style.textAlign = "left";
      hearderCelllabel.style.fontWeight = "bold";
      //hearderCelllabel.style.border='1px solid black';

      for (var i = 0; i < 22; i++) {
        var hearderCell = document.createElement("th");
        hearderCell.innerHTML = `${i + 1}`;
        hearderCell.style.fontWeight = "bold";
        hearderRow.appendChild(hearderCell);
        //hearderCell.style.border='1px solid black';
      }

      var tbody = tableLines.createTBody();

      for (let l = 0; l < fourTracks; l++) {
        const trackData = linesSummary[l];
        //  console.log(trackData);
        const row = tbody.insertRow(-1);
        if (trackData !== undefined && trackData.length > 0) {
          trackData.sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
          const cellLabel = row.insertCell(0);
          cellLabel.innerHTML = cellLabels[l];
          cellLabel.style.textAlign = "left";
          cellLabel.style.fontWeight = "bold";
          // cellLabel.style.border='1px solid black';
          // cellLabel.style.size='12px';
          trackData.forEach((item, index) => {
            const cell = row.insertCell(index + 1);
            if (item.outBlock > 0) {
              cell.style.color = "red";
              cell.style.cursor = "pointer";
              cell.title = "Total number: " + item.all;
            }
            cell.innerHTML = item.outBlock > 0 ? item.all - item.outBlock + "*" : item.all;
            //cell.style.border='1px solid black';
            //cell.style.fontSize='12px';

            //cell.style.width="20px"
          });
          document.getElementById("circosTable").appendChild(tableLines);
        }
      }
    }
  };

  //set tableData based on status
  //if compare, and no chromoid => add circleA and circleB
  //if compare with chromoid => add groupA and groupB
  //if not compare, no chromoid => add circle
  //if not compare, with chromid => add data
  let resultData = tableData;
  if (!form.compare) {
    if (chromoId > 0 || chromoId === "X" || chromoId === "Y") {
      resultData = tableData.length > 0 ? tableData : allValue;
      //filter data if zoomin for single chromo
    } else resultData = allValues;

    if (form.plotType.value === "circos") {
      //console.log(allValues);
      resultData = allValues;
    }
    //console.log(resultData, chromoId);
  } else {
    resultData = resultData.filter((c) => c.end !== "0");
  }
  resultData.sort((a, b) => Number(a.block_id) - Number(b.block_id));

  // Sorting function
  const defaultSort = [
    { id: "chromosome", asc: true },
    { id: "start", asc: true },
    { id: "end", asc: true },
  ];
  const sortData = (data, sortCriteria) => {
    return data.sort((a, b) => {
      for (let { id, asc } of sortCriteria) {
        const aValue = id === "start" || id === "end" ? Number(a[id]) : a[id];
        const bValue = id === "start" || id === "end" ? Number(b[id]) : b[id];
        if (aValue < bValue) return asc ? -1 : 1;
        if (aValue > bValue) return asc ? 1 : -1;
      }
      return 0;
    });
  };

  // Sort the resultData based on defaultSort
  const sortedData = sortData(resultData, defaultSort);

  const layout = {
    xaxis: {
      // title: "<b>Copy Number State</b>",
      zeroline: false,
      titlefont: {
        size: 14,
      },
      // side: "top",
    },
    yaxis: {
      title: "<b>Cellular Fraction</b>",
      tickfont: {
        size: 14,
      },
      range: [0, 1],
      automargin: true,
    },
    margin: {
      // l: 10,
      // r: 0,
      b: 20,
      t: 40,
      pad: 0,
    },
    autosize: true,

    title: "Cellular Fraction Violin Boxplot",
  };
  return (
    <Tabs activeKey={tab} onSelect={(e) => setTab(e)} className="mb-3">
      <Tab eventKey="summary" title="Summary">
        <div className="row justify-content-center">
          {!loaded ? (
            <LoadingOverlay active={!loaded} />
          ) : resultData.length === 0 ? (
            <h6 className="d-flex mx-2" style={{ margin: "10px", justifyContent: "center" }}>
              No Data Found
            </h6>
          ) : (
            ""
          )}
          <div className="">
            <Row className="">
              <Col className="col col-xl-12 d-flex justify-content-center align-items-center">
                <CirclePlotTest
                  ref={circleRef}
                  clickedChromoId={handleClickedChromoId}
                  key={clickedCounter}
                  loss={loss}
                  loh={loh}
                  gain={gain}
                  undetermined={undetermined}
                  allDenominator={allDenominator}
                  chrx={chrX}
                  chry={chrY}
                  figureHeight={figureHeight}
                  onHeightChange={handleheightChange}
                  onResetHeight={resetHeight}
                  onClickedChr={handleClickChr}
                  getData={handleDataChange}
                  onPair={handleCheckboxChange}
                  onLoading={handleSetLoading}></CirclePlotTest>
              </Col>
            </Row>
            <Row>{loaded ? checkMaxLines() : ""}</Row>
            <Row>
              <div className="">
                {/* <div className="d-flex " style={{ justifyContent: "flex-end" }}>
                  <ExcelFile
                    filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                    element={<button type="button" className="btn btn-link p-0">Export Data</button>}>
                    <ExcelSheet dataSet={exportTable(sortedData)} name="Autosomal mCA Distribution" />
                  </ExcelFile>
                </div> */}

                {/* Table hidden: reporting individual-level mCA data (Chromosome, Type, Cellular Fraction, Start, End, Detection Approach) raised study data-sharing concerns */}
                {/* <Table
                  columns={columns}
                  defaultSort={[
                    { id: "chromosome", asc: true },
                    { id: "start", asc: true },
                    { id: "end", asc: true },
                  ]}
                  data={resultData}
                /> */}
              </div>
            </Row>
          </div>
        </div>
      </Tab>
      {!form.compare ? (
        <Tab eventKey="scatter" title="Cellular Fraction">
          <Row className="m-3">
            <Col xl={12}>
              <Plot
                data={violinData}
                layout={layout}
                config={{
                  ...defaultConfig,
                  toImageButtonOptions: {
                    ...defaultConfig.toImageButtonOptions,
                    filename: "Violin boxplot",
                  },
                  responsive: true,
                }}
                style={{ width: "100%", height: browserSize.height * 0.7 }}
              />
              {/* <Plot
                data={getScatterData()}
                layout={{
                  xaxis: {
                    title: "<b>Chromosomes</b>",
                    zeroline: false,
                    titlefont: {
                      size: 16,
                    },
                    type: "category",
                  },
                  yaxis: {
                    title: "<b>Cellular Fraction</b>",
                    tickfont: {
                      size: 14,
                    },
                    automargin: true,
                  },
                  scattergap: 0.7,
                  autosize: true,
                  scattermode: "group",
                  tickmode: "linear",
                  title: "Cell Fraction Plot",
                }}
                config={{
                  ...defaultConfig,
                  toImageButtonOptions: {
                    ...defaultConfig.toImageButtonOptions,
                    filename: "All_Chromosomes",
                  },
                }}
                className="flex-fill w-100"
                style={{ height: browserSize.height }}
              /> */}
            </Col>
          </Row>
          <Row>
            <div className="m-3">
              {/* <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                <ExcelFile
                  filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                  element={<button type="button" className="btn btn-link p-0">Export Data</button>}>
                  <ExcelSheet dataSet={exportTable(sortedData)} name="Autosomal mCA Distribution" />
                </ExcelFile>
              </div> */}
              {/* Table hidden: reporting individual-level mCA data (Chromosome, Type, Cellular Fraction, Start, End, Detection Approach) raised study data-sharing concerns */}
              {/* <Table
                columns={columns}
                defaultSort={[
                  { id: "chromosome", asc: true },
                  { id: "start", asc: true },
                  { id: "end", asc: true },
                ]}
                data={resultData}
              /> */}
            </div>
          </Row>
        </Tab>
      ) : (
        ""
      )}
    </Tabs>
  );
}
