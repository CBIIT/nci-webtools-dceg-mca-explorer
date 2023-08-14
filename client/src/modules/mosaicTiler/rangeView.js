import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { formState } from "./explore.state";
import Plot from "react-plotly.js";
import { Tabs, Tab, Row, Col } from "react-bootstrap";
import { ExcelFile, ExcelSheet } from "../components/excel-export";
import Table from "../components/table";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest";
import Legend from "../components/legend";
import { Columns, exportTable } from "./tableColumns";
import { initialX, initialY } from "./constants";

export default function RangeView(props) {
  const [form, setForm] = useRecoilState(formState);
  const [tab, setTab] = useState("summary");
  const [clickedCounter, setClickedCounter] = useState(0);
  const [chromoId, setChromoId] = useState(-1);
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
    // form.sex,form.array,form.maxAge,form.minAge,form.maxFraction,form.minFraction,
    // form.ancestry,form.algorithm
  ]);

  useEffect(() => {}, []);

  async function handleSubmit(qdataset, qform) {
    setGain([]);
    setLoh([]);
    setLoss([]);
    setUndetermined([]);
    setChrX([]);
    setChrY([]);
    //setLoading(true)

    const response = await axios.post("api/opensearch/mca", {
      dataset: qdataset,
      sex: qform.sex,
      mincf: qform.minFraction,
      maxcf: qform.maxFraction,
      ancestry: qform.ancestry,
      types: qform.types,
    });
    let gainTemp = [];
    let lossTemp = [];
    let lohTemp = [];
    let undeterTemp = [];
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
    // if (form.chrY) {
    // }
    const chrXTemp = [];
    const chrYTemp = [];
    const results = response.data;
    //console.log(response)
    results.forEach((r) => {
      if (r._source !== null) {
        const d = r._source;
        if (d.cf != "nan") {
          d.block_id = d.chromosome.substring(3);
          d.value = d.cf;
          d.dataset = d.dataset.toUpperCase();
          d.start = d.beginGrch38;
          d.end = d.endGrch38;
          if (d.chromosome != "chrX") {
            if (d.type === "Gain") gainTemp.push(d);
            else if (d.type === "CN-LOH") lohTemp.push(d);
            else if (d.type === "Loss") lossTemp.push(d);
            else if (d.type === "Undetermined") undeterTemp.push(d);
          }
          if (form.chrX && d.type == "mLOX") {
            chrXTemp.push(d);
          }
          if (form.chrY && d.type == "mLOY") {
            chrYTemp.push(d);
            d.block_id = "Y";
          }
        }
      }
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
    setChrX(chrXTemp);
    setChrY(chrYTemp);
  }

  // const gain = form.types.find((e) => e.value === "gain") ? form.study.length === 2? allgain: study_value.value==='plco'?plcogain:ukgain : []
  // const loss = form.types.find((e) => e.value === "loss") ? form.study.length === 2? allloss: study_value.value==='plco'?plcoloss:ukloss : []
  // const loh = form.types.find((e) => e.value === "loh") ? form.study.length === 2? allloh: study_value.value==='plco'?plcoloh:ukloh : []
  // const undetermined = form.types.find((e) => e.value === "undetermined") ? form.study.length === 2 ? allundetermined :
  //                         study_value.value ==='plco'?plcoundetermined:ukundetermined : []

  useEffect(() => {
    setClickedCounter(clickedCounter + 1);
  }, [gain, loss, loh, undetermined, chrX, chrY]);

  //console.log(clickedCounter)
  const chromosomes = form.chromosome.map((e) => e.label);

  const sortGain = gain
    .filter((e) => chromosomes.includes(Number(e.block_id)))
    .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  const sortLoss = loss
    .filter((e) => chromosomes.includes(Number(e.block_id)))
    .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  const sortLoh = loh
    .filter((e) => chromosomes.includes(Number(e.block_id)))
    .sort((a, b) => Number(a.block_id) - Number(b.block_id));
  const sortUndetermined = undetermined
    .filter((e) => chromosomes.includes(Number(e.block_id)))
    .sort((a, b) => Number(a.block_id) - Number(b.block_id));

  const sortX = chrX.filter((e) => chromosomes.includes("X")).sort((a, b) => Number(a.block_id) - Number(b.block_id));
  const sortY = chrY.filter((e) => chromosomes.includes("Y")).sort((a, b) => Number(a.block_id) - Number(b.block_id));

  const allValues = sortGain.concat(sortLoss).concat(sortLoh).concat(sortUndetermined).concat(sortX).concat(sortY);

  //console.log(gain, sortGain, chromosomes);
  useEffect(() => {
    //console.log(form);
    const clickedValues = allValues.filter((v) => v.block_id === chromoId);
    setAllValue([...clickedValues]);
    //this is for single chromosome
  }, [chromoId]);

  const columns = Columns;

  function getScatterData() {
    const gainScatter = {
      x: sortGain.map((e) => {
        return Number(e.block_id);
      }),
      y: sortGain.map((e) => {
        return Number(e.value);
      }),
      name: "Gain",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(26,150,46)",
      },
      hovertext: sortGain.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const lossScatter = {
      x: sortLoss.map((e) => {
        return Number(e.block_id);
      }),
      y: sortLoss.map((e) => {
        return Number(e.value);
      }),
      name: "Loss",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(255,0,0)",
      },
      hovertext: sortLoss.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const lohScatter = {
      x: sortLoh.map((e) => {
        return Number(e.block_id);
      }),
      y: sortLoh.map((e) => {
        return Number(e.value);
      }),
      name: "LOH",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(31,119,180)",
      },
      hovertext: sortLoh.map((e) => {
        var text = "<br>Start: " + e.start;
        text = text + "<br>End: " + e.end;
        return text;
      }),
      hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
    };

    const undeterminedScatter = {
      x: sortUndetermined.map((e) => {
        return Number(e.block_id);
      }),
      y: sortUndetermined.map((e) => {
        return Number(e.value);
      }),
      name: "Undetermined",
      type: "scatter",
      mode: "markers",
      marker: {
        color: "rgb(77,77,77)",
      },
      hovertext: sortUndetermined.map((e) => {
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
    setTableData(data);
  };
  const handleCheckboxChange = () => {
    props.onPair();
  };

  //set tableData based on status
  //if compare, and no chromoid => add circleA and circleB
  //if compare with chromoid => add groupA and groupB
  //if not compare, no chromoid => add circle
  //if not compare, with chromid => add data
  let resultData = tableData;
  if (!form.compare) {
    if (chromoId > 0) {
      resultData = allValue;
    } else resultData = allValues;
  }

  return (
    <Tabs activeKey={tab} onSelect={(e) => setTab(e)} className="mb-3">
      <Tab eventKey="summary" title="Summary">
        <div className="row justify-content-center">
          {allValues.length == 0 && form.counterSubmitted > 0 && !form.compare ? (
            <h6 className="d-flex mx-3">Loading and rendering...</h6>
          ) : (
            ""
          )}
          {chrX.length > 0 || chrY.length > 0 ? (
            <p>X, Y are representative subjects and all samples couldn’t be visualized</p>
          ) : (
            ""
          )}
          <div className="">
            <Row>
              {/* <Col className="col col-xl-3 col-lg-3 col-md-3 col-sm-1"></Col> */}
              <Col className="col col-xl-12 d-flex justify-content-end ">
                <Legend></Legend>
              </Col>
            </Row>
            <Row className="">
              <Col className="col col-xl-12 d-flex justify-content-center align-items-center">
                <CirclePlotTest
                  clickedChromoId={handleClickedChromoId}
                  key={clickedCounter}
                  loss={loss}
                  loh={loh}
                  gain={gain}
                  undetermined={undetermined}
                  chrx={chrX}
                  chry={chrY}
                  figureHeight={figureHeight}
                  onHeightChange={handleheightChange}
                  onResetHeight={resetHeight}
                  onClickedChr={handleClickChr}
                  getData={handleDataChange}
                  onPair={handleCheckboxChange}></CirclePlotTest>
              </Col>
            </Row>
            <Row>
              <div className="m-3">
                <div className="d-flex " style={{ justifyContent: "flex-end" }}>
                  <ExcelFile
                    filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                    element={<a href="javascript:void(0)">Export Data</a>}>
                    <ExcelSheet dataSet={exportTable(resultData)} name="Autosomal mCA Distribution" />
                  </ExcelFile>
                </div>

                <Table columns={columns} defaultSort={[{ id: "start", asc: true }]} data={resultData} />
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
              <Table columns={columns} defaultSort={[{ id: "start", asc: true }]} data={resultData} />
            </div>
          </Row>
        </Tab>
      ) : (
        ""
      )}
    </Tabs>
  );
}
