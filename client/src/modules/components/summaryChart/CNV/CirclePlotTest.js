import * as React from "react";
import { useEffect, useState, useRef } from "react";
import Circos, { HIGHLIGHT, STACK } from "react-circos";
import layout from "./layout2.json";
import band from "./band.json";
import "./css/circos.css";
import SingleChromosome from "./SingleChromosome";
import { Row, Col, Button, Container } from "react-bootstrap";
import { formState } from "../../../mosaicTiler/explore.state";
import { useRecoilState } from "recoil";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";
import CircosPlot from "./CirclePlot";
import CircosPlotCompare from "./CirclePlotCompare";
// import { initialXY } from "../../../mosaicTiler/rangeView";
// import { ExcelFile, ExcelSheet } from "../../excel-export";
// import Table from "../../table";
// import { Columns, exportTable } from "../../../mosaicTiler/tableColumns";
//import "./styles.css";
const hovertip = (d) => {
  return (
    "<p style='text-align:left'>Sid: " +
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
    d.ancestry +
    "<br> Sex: " +
    d.computedGender +
    "<br> Age: " +
    d.age +
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
  const [showChart, setShowChart] = useState(false);
  const [chromesomeId, setChromesomeId] = useState(0);
  const [form, setForm] = useRecoilState(formState);
  const [countFilter, setCountFilter] = useState(0);
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);
  const [titleA, setTitleA] = useState("A");
  const [titleB, setTitleB] = useState("B");
  const [circleA, setCircleA] = useState(null);
  const [circleB, setCircleB] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [browserSize, setBrowserSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [zoomRangeA, setZoomRangeA] = useState(null);
  const [zoomRangeB, setZoomRangeB] = useState(null);

  //use this figuresHeight to control the height after gene table created
  const [figureHeight, setFigureHeight] = useState(0);
  //
  const [isLoaded, setIsLoaded] = useState(false);

  let adjustWidth = 1;
  if (browserSize.width > 1200 && browserSize.width < 1600) adjustWidth = 0.55;
  else if (browserSize.width >= 1600) adjustWidth = 0.48;
  else adjustWidth = 0.7;
  const size = browserSize.width * adjustWidth;
  const compareCircleSize = size * (adjustWidth + 0.1);

  const clearBtn = document.getElementById("clearCompare");
  //console.log(browserSize.width, size);
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
            //console.log('mouseover',bck,b.__data__.key);//b.__data__.key is the chromesome id
            if (b.__data__.key !== "X" && b.__data__.key !== "Y") {
              alltracks.forEach((t) => changeBackground(t, b.__data__.key, 1));
            } else alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0.5));
          });
          bck.addEventListener("mouseout", () => {
            if (b.__data__.key !== "X" && b.__data__.key !== "Y")
              alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0.5));
            else alltracks.forEach((t) => changeBackground(t, b.__data__.key, 0));
          });
          bck.addEventListener("click", () => {
            //console.log("click",b.__data__.key)
            setShowChart(true);
            props.onClickedChr(true);
            setChromesomeId(b.__data__.key);
            sendClickedId(b.__data__.key);
            const cid = "chr" + b.__data__.key;
            const chrid = form.chromosome.filter((c) => c.value === cid);
            setForm({ ...form, chromosome: chrid });
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
    props.onClickedChr(false);
    setForm({
      ...form,
      compare: false,
      showCompare: false,
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
    clearBtn.click();
  };
  const handleBackChromo = () => {
    setForm({ ...form, compare: false });
    setFigureHeight(0);
    props.onResetHeight();
    setZoomRangeA(null);
    setZoomRangeB(null);
    clearBtn.click();
  };
  const handleZoomChange = (event, group) => {
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

  let data = [];
  useEffect(() => {
    //console.log("do query...");
    setTableData([]);
    if (form.compare) {
      setCircleA(null);
      setCircleB(null);
      handleGroupQuery(form.groupA).then((data) => (showChart ? setGroupA(data) : setCircleA({ ...data })));
      handleGroupQuery(form.groupB).then((data) => (showChart ? setGroupB(data) : setCircleB({ ...data })));
    } else {
      console.log("clear form");
    }
  }, [form.counterCompare]);

  const handleCompareHeightChange = (height) => {
    setFigureHeight(height);
  };
  data = [
    ...props.gain.filter((chr) => chr.block_id === chromesomeId),
    ...props.loh.filter((chr) => chr.block_id === chromesomeId),
    ...props.loss.filter((chr) => chr.block_id === chromesomeId),
    ...props.undetermined.filter((chr) => chr.block_id === chromesomeId),
    ...props.chrx.filter((chr) => chr.block_id === chromesomeId),
    ...props.chry.filter((chr) => chr.block_id === chromesomeId),
    // ...props.chry.filter(chr=>chr.block_id===chromesomeId)
  ];
  //do query for group compare:
  async function handleGroupQuery(group) {
    //setLoading(true)
    const result = [];
    let query = {};
    let response = "";
    let circleTemp = {};
    const gainTemp = [];
    const lohTemp = [];
    const lossTemp = [];
    const undeterTemp = [];
    const chrXTemp = [];
    const chrYTemp = [];
    if (!Array.isArray(group)) {
      if (chromesomeId > 0) {
        query = { ...group, chr: chromesomeId };
        response = await axios.post("api/opensearch/chromosome", { search: query });
      } else {
        //console.log("do query...", group, chromesomeId);
        const dataset = group.study;
        const sex = group.sex;
        //{ dataset: qdataset, sex: qsex }
        response = await axios.post("api/opensearch/mca", { dataset: dataset, sex: sex });
      }

      const results = response.data;

      results.forEach((r) => {
        if (r._source !== null) {
          const d = r._source;
          if (d.cf != "nan") {
            d.block_id = d.chromosome.substring(3);
            d.value = d.cf;
            d.dataset = d.dataset.toUpperCase();
            d.start = Number(d.beginGrch38);
            d.end = Number(d.endGrch38);
            d.length = Number(d.length);

            //
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
            result.push(d);
          }
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

    if (showChart) return result;
    else return circleTemp;
  }
  useEffect(() => {
    if (chromesomeId > 0) {
      setTitleA(groupTitle(form.groupA)); // + "\nTotal: " + groupA.length);
      setTitleB(groupTitle(form.groupB)); // + "\nTotal: " + groupB.length);
    } else {
      setTitleA(groupTitle(form.groupA)); // + "; " + circleTitle(circleA));
      setTitleB(groupTitle(form.groupB)); // + "; " + circleTitle(circleB));
    }
  });
  useEffect(() => {
    if (circleA !== null) {
      setTableData([...circleA.loss, ...circleA.gain, ...circleA.loh, ...circleA.undetermined, ...tableData]);
    }
  }, [circleA]);
  useEffect(() => {
    if (circleB !== null) {
      setTableData([...circleB.loss, ...circleB.gain, ...circleB.loh, ...circleB.undetermined, ...tableData]);
    }
  }, [circleB]);
  useEffect(() => {
    if (groupA !== null) {
      setTableData([...groupA, ...tableData]);
    }
  }, [groupA]);
  useEffect(() => {
    if (groupB !== null) {
      setTableData([...groupB, ...tableData]);
    }
  }, [groupB]);
  const groupTitle = (group) => {
    let title = "";
    if (group != undefined) {
      if (group.study !== undefined) {
        group.study.forEach((s) => {
          title += s.label + ", ";
        });
      }
      if (group.sex !== undefined) {
        group.sex.forEach((s) => {
          title += s.label + ", ";
        });
      }
      if (group.array !== undefined) {
        group.array.forEach((s) => {
          title += s.label + ", ";
        });
      }
      if (group.ancestry !== undefined) {
        group.ancestry.forEach((s) => {
          title += s.label + ", ";
        });
      }
    }
    return title.substring(0, title.length - 2);
  };

  const isCircleNull = (circle) => {
    if (circle !== null)
      return circle.gain.length + circle.loh.length + circle.loss.length + circle.undetermined.length === 0;
    else return true;
  };
  const circleTitle = (circle) => {
    let title = "";
    if (circle !== null) {
      title +=
        "\nGain: " +
        circle.gain.length +
        " Neutral: " +
        circle.loh.length +
        " Loss: " +
        circle.loss.length +
        " Undetermined: " +
        circle.undetermined.length;
    }
    return title;
  };

  //if window size is small, stack circle comparison plots and needs more space above footer
  //chromosome comparison plots can automatically stack and no need extra space
  // useEffect(() => {
  //   let ifExtraSpace = false;
  //   const temp = document.getElementsByClassName("tableRow");
  //   if (temp.length == 0) document.getElementById("footer").style.marginTop = "0px";
  //   if (temp.length > 0 && window.innerWidth < 2000) document.getElementById("footer").style.marginTop = "700px";
  //   const handleResize = () => {
  //     ifExtraSpace = window.innerWidth < 2000;
  //     //console.log(ifExtraSpace);
  //     if (temp.length > 0 && ifExtraSpace) document.getElementById("footer").style.marginTop = "700px";
  //     if (!ifExtraSpace) document.getElementById("footer").style.marginTop = "0px";
  //   };
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // });
  //console.log(data,dataCompared)
  //only disply 200 events for X and Y
  const dataXY = [...props.chrx.slice(0, 200), ...props.chry.slice(0, 200)];
  //console.log("gain:",props.gain.length,"loh:",props.loh.length,
  //"loss:",props.loss.length,"under:",props.undetermined.length)
  const linethickness = -1.75;
  const thicknessgain = props.gain.length < 1000 ? 0 : linethickness;
  const thicknessloh = props.loh.length < 1000 ? 0 : -1.9;
  const thicknessloss = props.loss.length < 1000 ? 0 : linethickness;
  const thicknessundermined = props.undetermined.length < 1000 ? 0 : linethickness;

  let layoutAll = !form.chrX || form.chrX === undefined ? layout.filter((l) => l.label !== "X") : layout;
  layoutAll = !form.chrY || form.chrY === undefined ? layoutAll.filter((l) => l.label !== "Y") : layoutAll;

  let singleFigWidth = form.compare ? size * 0.45 : size;
  props.getData(tableData);

  return (
    <Container className="compareContainer align-middle text-center">
      <div>
        {showChart ? (
          <div style={{ height: compareCircleSize + figureHeight + 620, left: 0 }}>
            <p>Chromosome {chromesomeId}</p>
            {form.compare && (
              <>
                <Row className="justify-content-center">
                  {/* <Col>
                    <Button variant="link" onClick={handleBack}>
                      Back to circle summary
                    </Button>
                  </Col> */}
                  <Col>
                    <Button variant="link" onClick={handleBackChromo}>
                      Back to chromosome
                    </Button>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col className="col d-flex justify-content-center" xs md={6} lg={6}>
                    <div style={{ position: "sticky", top: 0 }}>
                      <SingleChromosome
                        onZoomChange={handleZoomChange}
                        zoomRange={zoomRangeA}
                        data={groupA}
                        title={titleA}
                        details="A"
                        chromesomeId={chromesomeId}
                        width={singleFigWidth}
                        height={singleFigWidth}
                        onHeightChange={props.onHeightChange}
                        onCompareHeightChange={handleCompareHeightChange}></SingleChromosome>
                    </div>
                  </Col>
                  <Col className="col d-flex justify-content-center" xs md={6} lg={6}>
                    <div style={{ position: "sticky", top: 0 }}>
                      <SingleChromosome
                        onZoomChange={handleZoomChange}
                        zoomRange={zoomRangeB}
                        data={groupB}
                        title={titleB}
                        details="B"
                        chromesomeId={chromesomeId}
                        width={singleFigWidth}
                        height={singleFigWidth}
                        onHeightChange={props.onHeightChange}
                        onCompareHeightChange={handleCompareHeightChange}></SingleChromosome>
                    </div>
                  </Col>
                </Row>
                {/* {form.compare && (
                  <Row className="">
                    <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                      <ExcelFile filename={"Compare"} element={<a href="javascript:void(0)">Export Data</a>}>
                        <ExcelSheet dataSet={exportTable(tableData)} name="compare" />
                      </ExcelFile>
                    </div>
                    <div className="mx-3">
                      <Table columns={Columns} defaultSort={[{ id: "start", asc: true }]} data={tableData} />
                    </div>
                  </Row>
                )} */}
              </>
            )}
            {!form.compare && (
              <>
                <Row className="justify-content-center">
                  <Button variant="link" onClick={handleBack}>
                    Back to circle summary
                  </Button>
                </Row>

                <Row className="justify-content-center">
                  <Col className="col col-xl-12 d-flex justify-content-center align-items-center">
                    <SingleChromosome
                      data={data}
                      chromesomeId={chromesomeId}
                      width={size * 0.8}
                      height={browserSize.height * 0.7}
                      onHeightChange={props.onHeightChange}></SingleChromosome>
                  </Col>
                </Row>
              </>
            )}
          </div>
        ) : form.compare ? (
          <div style={{ height: 2 * compareCircleSize + 200, left: 0 }}>
            <Button variant="link" onClick={handleBack} className="">
              Back to circle summary
            </Button>
            <div>
              <Row className="justify-content-center">
                <Col xs={12} md={6} lg={6} style={{ width: compareCircleSize, height: compareCircleSize }}>
                  {circleA ? (
                    <CircosPlotCompare
                      layoutAll={layoutAll}
                      title={titleA}
                      dataXY={[]}
                      //details={titleA}
                      size={compareCircleSize}
                      thicknessloss={thicknessloss}
                      thicknessgain={thicknessgain}
                      thicknessundermined={thicknessundermined}
                      thicknessloh={thicknessloh}
                      circle={circleA}
                      circleRef={circleRef}
                      //circleClass="overlayX2"
                      handleEnter={handleEnter}
                      hovertip={hovertip}></CircosPlotCompare>
                  ) : (
                    ""
                  )}
                </Col>
                <Col xs={12} md={6} lg={6} style={{ width: compareCircleSize, height: compareCircleSize }}>
                  {circleB ? (
                    <CircosPlotCompare
                      layoutAll={layoutAll}
                      dataXY={[]}
                      title={titleB}
                      //details="B"
                      size={compareCircleSize}
                      thicknessloss={thicknessloss}
                      thicknessgain={thicknessgain}
                      thicknessundermined={thicknessundermined}
                      thicknessloh={thicknessloh}
                      circle={circleB}
                      circleRef={circleRef}
                      handleEnter={handleEnter}
                      //circleClass="overlayX3"
                      hovertip={hovertip}></CircosPlotCompare>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>

              {/* {form.compare && !showChart && (
                <Row className="tableRow">
                  <div className="d-flex" style={{ justifyContent: "flex-end" }}>
                    <ExcelFile filename={"Compare"} element={<a href="javascript:void(0)">Export Data</a>}>
                      <ExcelSheet dataSet={exportTable(tableData)} name="compare" />
                    </ExcelFile>
                  </div>
                  <div className="mx-3">
                    <Table columns={Columns} defaultSort={[{ id: "start", asc: true }]} data={tableData} />
                  </div>
                </Row>
              )} */}
            </div>
          </div>
        ) : (
          <div>
            {true && (
              <CircosPlot
                layoutAll={layoutAll}
                dataXY={dataXY}
                title="Autosomal mCA Distribution "
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
            )}
          </div>
        )}
      </div>
      {/* <div>
        {form.compare && !showChart && (
          <Row className="tableRow">
            <div className="d-flex" style={{ justifyContent: "flex-end" }}>
              <ExcelFile filename={"Compare"} element={<a href="javascript:void(0)">Export Data</a>}>
                <ExcelSheet dataSet={exportTable(tableData)} name="compare" />
              </ExcelFile>
            </div>
            <div className="mx-3">
              <Table columns={Columns} defaultSort={[{ id: "start", asc: true }]} data={tableData} />
            </div>
          </Row>
        )}
      </div> */}
    </Container>
  );
}
