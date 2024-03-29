import { useState, useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { formState } from "./explore.state";
import Plot from "react-plotly.js";
import { Tabs, Tab, Row, Col, Spinner } from "react-bootstrap";
import { ExcelFile, ExcelSheet } from "../components/excel-export";
import Table from "../components/table";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest";
import Legend from "../components/legend";
import { Columns, exportTable } from "./tableColumns";
import { initialX, initialY, AncestryOptions, smokeNFC, SexOptions } from "./constants";
import { LoadingOverlay } from "../components/controls/loading-overlay/loading-overlay";

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

  const [gain, setGain] = useState([]);
  const [loss, setLoss] = useState([]);
  const [loh, setLoh] = useState([]);
  const [undetermined, setUndetermined] = useState([]);
  const [chrX, setChrX] = useState([]);
  const [chrY, setChrY] = useState([]);
  const [tableData, setTableData] = useState([]); //for compare data
  const [loaded, setLoaded] = useState(false);
  const [allDenominator, setAllDenominator] = useState(0);
  const circleRef = useRef(null);

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
    setGain([]);
    setLoh([]);
    setLoss([]);
    setUndetermined([]);
    setChrX([]);
    setChrY([]);
    setLoaded(false);
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

    const response = await axios.post("api/opensearch/mca", query);
    let gainTemp = [];
    let lossTemp = [];
    let lohTemp = [];
    let undeterTemp = [];
    //find the total number of denominator based on query
    let allresponseDenominator = await axios.post("api/opensearch/denominator", query);

    //console.log(response.data.denominator.length, allresponseDenominator.data);
    setAllDenominator(allresponseDenominator.data);
    const chrXTemp = [];
    const chrYTemp = [];
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
      results = response.data.denominator;
      responseDenominator = response.data.nominator;
    } else {
      results = response.data.nominator;
      responseDenominator = response.data.denominator;
    }

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
    //console.log(mergedResult.length);
    // const denominatorMap = new Map(responseDenominator.map((item) => [item._source.sampleId, item._source]));
    console.log(form);
    mergedResult.forEach((r) => {
      //if (r._source !== null) {
      const d = r;
      if (d.cf != "nan") {
        d.block_id = d.chromosome.substring(3);
        d.value = d.cf;
        d.dataset = d.dataset.toUpperCase();
        d.start = d.beginGrch38;
        d.end = d.endGrch38;
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

        //d.sex = d.sex === 0?"F":"M"
        //console.log(d)
        if (d.chromosome != "chrX") {
          if (d.type === "Gain") gainTemp.push(d);
          else if (d.type === "CN-LOH") lohTemp.push(d);
          else if (d.type === "Loss") lossTemp.push(d);
          else if (d.type === "Undetermined") undeterTemp.push(d);
        }
        //for whole, and select X or Y
        else {
          if (d.type === "mLOX") {
            chrXTemp.push(d);
            d.block_id = "X";
          }
          if (d.type === "mLOY") {
            chrYTemp.push(d);
            d.block_id = "Y";
          }
        }
      }
      //}
    });
    // setLoading(false)
    if (form.types.find((e) => e.value === "all")) {
      setGain(gainTemp);
      setLoss(lossTemp);
      setLoh(lohTemp);
      setUndetermined(undeterTemp);
    } else {
      if (form.types.find((e) => e.value === "gain")) setGain(gainTemp);
      if (form.types.find((e) => e.value === "loss")) setLoss(lossTemp);
      if (form.types.find((e) => e.value === "loh")) setLoh(lohTemp);
      if (form.types.find((e) => e.value === "undetermined")) setUndetermined(undeterTemp);
    }
    console.log(chrXTemp.length);
    setChrX(chrXTemp);
    setChrY(chrYTemp);
    setLoaded(true);
  }

  useEffect(() => {
    setClickedCounter(clickedCounter + 1);
    //console.log(chrX);
    if (form.plotType.value === "static") {
      setAllValue([...allValues]);
    }
    handleDataChange(allValues);
  }, [gain, loss, loh, undetermined, chrX, chrY]);

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
  const allValues = gain.concat(loss).concat(loh).concat(undetermined).concat(chrX).concat(chrY);
  //console.log(gain, sortGain, chromosomes);
  useEffect(() => {
    const clickedValues = allValues.filter((v) => v.block_id === chromoId);
    setAllValue([...clickedValues]);
    //this is for single chromosome
  }, [chromoId]);

  const columns = Columns;

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
    // console.log(data.length);
    setTableData(data);
  };
  const handleCheckboxChange = () => {
    props.onPair();
  };

  const handleSetLoading = (val) => {
    setLoaded(val);
  };
  const checkMaxLines = () => {
    let totalLines = 0;
    const linesSummary = {};
    const cellLabels = ["Undetermined", "Loss", "CN-LOH", "Gain"];
    // console.log(circleRef.current,document.getElementById('circosTable').rows.length)
    if (circleRef.current && loaded && document.getElementById("circosTable").getElementsByTagName("tr").length === 0) {
      [".track-0", ".track-1", ".track-2", ".track-3"].forEach((trackClass, index) => {
        const track = document.querySelectorAll(`${trackClass}` + " .block");
        console.log(track.length);
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
            totalLines += paths.length;
            //console.log(paths.length)
            //console.log(t.__data__,counterNotL,paths.length)
            var oline = chromosomes.find((o) => o.key === Number(t.__data__.key));
            if (oline) {
              oline.outBlock = counterNotL[0] ? counterNotL[0] - 1 : 0;
              oline.all = paths.length - 1;
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
      //hearderCelllabel.style.border='1px solid black';

      for (var i = 0; i < 22; i++) {
        var hearderCell = document.createElement("th");
        hearderCell.innerHTML = `${i + 1}`;
        hearderRow.appendChild(hearderCell);
        //hearderCell.style.border='1px solid black';
      }

      var tbody = tableLines.createTBody();

      for (let l = 0; l < fourTracks; l++) {
        const trackData = linesSummary[l];
        console.log(trackData);
        const row = tbody.insertRow(-1);
        if (trackData !== undefined && trackData.length > 0) {
          trackData.sort((a, b) => parseInt(a.key, 10) - parseInt(b.key, 10));
          const cellLabel = row.insertCell(0);
          cellLabel.innerHTML = cellLabels[l];
          // cellLabel.style.border='1px solid black';
          // cellLabel.style.size='12px';
          trackData.forEach((item, index) => {
            const cell = row.insertCell(index + 1);
            cell.innerHTML = (item.outBlock > 0 ? item.outBlock + "/" : "") + item.all;
            //cell.style.border='1px solid black';
            //cell.style.fontSize='12px';
            cell.style.color = item.outBlock > 0 ? "red" : "";
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
    if (chromoId > 0) {
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
          {chrX.length > 0 || chrY.length > 0 ? (
            <p>X, Y are representative subjects and all samples couldn’t be visualized</p>
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
                  loss={[...loss, ...(form.chrX ? initialX : []), ...(form.chrY ? initialY : [])]}
                  loh={[...loh, ...(form.chrX ? initialX : []), ...(form.chrY ? initialY : [])]}
                  gain={[...gain, ...(form.chrX ? initialX : []), ...(form.chrY ? initialY : [])]}
                  undetermined={[...undetermined, ...(form.chrX ? initialX : []), ...(form.chrY ? initialY : [])]}
                  //allDenominator={allDenominator}
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
              <div className="m-3">
                <div className="d-flex " style={{ justifyContent: "flex-end" }}>
                  <ExcelFile
                    filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                    element={<a href="javascript:void(0)">Export Data</a>}>
                    <ExcelSheet dataSet={exportTable(resultData)} name="Autosomal mCA Distribution" />
                  </ExcelFile>
                </div>

                <Table
                  columns={columns}
                  defaultSort={[
                    { id: "chromosome", asc: true },
                    { id: "start", asc: true },
                    { id: "end", asc: true },
                  ]}
                  data={resultData}
                />
              </div>
            </Row>
          </div>
        </div>
      </Tab>
      {!form.compare ? (
        <Tab eventKey="scatter" title="Scatter">
          <Row className="m-3">
            <Col xl={12}>
              <Plot
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
              />
            </Col>
          </Row>
          <Row>
            <div className="m-3">
              <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                <ExcelFile
                  filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                  element={<a href="javascript:void(0)">Export Data</a>}>
                  <ExcelSheet dataSet={exportTable(resultData)} name="Autosomal mCA Distribution" />
                </ExcelFile>
              </div>
              <Table
                columns={columns}
                defaultSort={[
                  { id: "chromosome", asc: true },
                  { id: "start", asc: true },
                  { id: "end", asc: true },
                ]}
                data={resultData}
              />
            </div>
          </Row>
        </Tab>
      ) : (
        ""
      )}
    </Tabs>
  );
}
