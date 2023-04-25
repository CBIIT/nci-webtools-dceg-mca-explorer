import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import axios from "axios";
import { formState } from "./explore.state";
import Plot from "react-plotly.js"
import { Tabs, Tab, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ExcelFile, ExcelSheet } from "../components/excel-export";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest"
import Legend from "../components/legend";

import Table from "../components/table";

  const initialXY= [
        {"block_id": "X","start": "0", "end": "0","type": "Gain"},
        {"block_id": "Y", "start": "0", "end": "0","type": "Gain"},
        {"block_id": "X","start": "0", "end": "0","type": "Loss"},
        {"block_id": "Y", "start": "0", "end": "0","type": "Loss"},
        {"block_id": "X","start": "0", "end": "0","type": "CN-LOH"},
        {"block_id": "Y", "start": "0", "end": "0","type": "CH-LOH"},
        {"block_id": "X","start": "0", "end": "0","type": "Undetermined"},
        {"block_id": "Y", "start": "0", "end": "0","type": "Undetermined"},
  ]
const chartHeight = 800
export default function RangeView() {
    const [form, setForm] = useRecoilState(formState);
    const [tab, setTab] = useState("summary");
    const [clickedCounter, setClickedCounter] = useState(0);
    const [chromoId, setChromoId] = useState(-1);
    const [allValue, setAllValue] = useState([]);
    //console.log(form)
    //console.log(form.study.length)

    const [figureHeight, setFigureHeight] = useState(chartHeight)
   
    const [gain,setGain] = useState([])
    const [loss,setLoss] = useState([])
    const [loh,setLoh] = useState([])
    const [undetermined,setUndetermined] = useState([])
    const [chrX, setChrX] = useState([])
    const [chrY, setChrY] = useState([])

    const study_value = form.study
    let query_value = []
    Array.isArray(study_value)?
    query_value =[...study_value,form.chrX?{"value":'X'}:'',form.chrY?{"value":'Y'}:'']
    : query_value =[study_value,form.chrX?{"value":'X'}:'',form.chrY?{"value":'Y'}:'']


   // console.log(query_value)
    useEffect(() => {
    if (true) {
        handleSubmit(query_value)
    } else {
     
    }
  }, [form]);
    

  async function handleSubmit(query) {

    //setLoading(true)
    const response = await axios.post("api/opensearch", { search: query })
    const gainTemp = [...initialXY]
    const lossTemp = [...initialXY]
    const lohTemp = [...initialXY]
    const undeterTemp = [...initialXY]
    const chrXTemp = []
    const chrYTemp = []
    const results = response.data
    //console.log(response)
    results.forEach(r=>{
      if (r._source !== null){
        const d = r._source
        if(d.cf != "nan"){
            d.block_id = d.chromosome.substring(3)
            d.value = d.cf
            d.start = d.beginGrch38
            d.end = d.endGrch38
            if(d.chromosome!="chrX"){
             if (d.type === "Gain")
                    gainTemp.push(d)
                else if (d.type === "CN-LOH")
                    lohTemp.push(d)
                else if (d.type === "Loss")
                    lossTemp.push(d)
                else if (d.type === "Undetermined")
                    undeterTemp.push(d)
                }
                if(form.chrX&&(d.type == "mLOX")){
                    chrXTemp.push(d)
                }
                if(form.chrY&&(d.type == "mLOY")){
                    chrYTemp.push(d)
                    d.block_id = "Y"
                }
            }
      }
    })
   // setLoading(false)
    setGain(gainTemp)
    setLoh(lohTemp)
    setLoss(lossTemp)
    setUndetermined(undeterTemp)
    setChrX(chrXTemp)
    setChrY(chrYTemp)
  }
 
    // const gain = form.types.find((e) => e.value === "gain") ? form.study.length === 2? allgain: study_value.value==='plco'?plcogain:ukgain : []
    // const loss = form.types.find((e) => e.value === "loss") ? form.study.length === 2? allloss: study_value.value==='plco'?plcoloss:ukloss : []
    // const loh = form.types.find((e) => e.value === "loh") ? form.study.length === 2? allloh: study_value.value==='plco'?plcoloh:ukloh : []
    // const undetermined = form.types.find((e) => e.value === "undetermined") ? form.study.length === 2 ? allundetermined : 
    //                         study_value.value ==='plco'?plcoundetermined:ukundetermined : []

    useEffect(() => {
       setClickedCounter(clickedCounter+1)
    },[gain,loss,loh,undetermined,chrX,chrY])

    //console.log(clickedCounter)
    const chromosomes = form.chromosome.map((e) => e.label)

    const sortGain = gain.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortLoss = loss.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortLoh = loh.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortUndetermined = undetermined.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const allValues = sortGain.concat(sortLoss).concat(sortLoh).concat(sortUndetermined)
   
    useEffect(() => {
        const clickedValues = allValues.filter((v) =>v.block_id===chromoId)
       setAllValue([...clickedValues])
        console.log("click chromesome",allValue)
    },[chromoId])
    const columns = [
        {
            accessor: "sampleId",
            id: "sampleId",
            label: "sampleId",
            Header: <b>Sample ID</b>
        },
        {
            accessor: "dataset",
            id: "dataset",
            label: "Dataset",
            Header: <b>Dataset</b>
        },
        {
            accessor: "block_id",
            id: "chromosome",
            label: "Chromosome",
            Header: <b>Chromosome</b>
        },
        {
            accessor: "type",
            id: "type",
            label: "Type",
            Header: <b>Type</b>
        },
        {
            accessor: "value",
            id: "value",
            label: "value",
            Header: <b>Cellular Fraction</b>
        },
        {
            accessor: "start",
            id: "start",
            label: "Start",
            Header: (
                <OverlayTrigger overlay={<Tooltip id="start_position">Event Start Position</Tooltip>}>
                    <b>Start</b>
                </OverlayTrigger>
            ),
        },
        {
            accessor: "end",
            id: "end",
            label: "End",
            Header: (
                <OverlayTrigger overlay={<Tooltip id="end_position">Event End Position</Tooltip>}>
                    <b>End</b>
                </OverlayTrigger>
            ),
        },
        {
            accessor: "ancestry",
            id: "ancestry",
            label: "Ancestry",
            Header: <b>Ancestry</b>
        },
        {
            accessor: "sex",
            id: "sex",
            label: "Sex",
            Header: <b>Sex</b>
        },
         {
            accessor: "age",
            id: "age",
            label: "Age",
            Header: <b>Age</b>
        },
    ]

    function getScatterData() {
        const gainScatter = {
            x: sortGain.map((e) => { return (Number(e.block_id)) }),
            y: sortGain.map((e) => { return (Number(e.value)) }),
            name: "Gain",
            type: "scatter",
            mode: "markers",
            marker: {
                color: "rgb(26,150,46)",
            },
            hovertext: sortGain.map((e) => {
                var text = "<br>Start: " + e.start;
                text = text + "<br>End: " + e.end;
                return text
            }),
            hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
        }

        const lossScatter = {
            x: sortLoss.map((e) => { return (Number(e.block_id)) }),
            y: sortLoss.map((e) => { return (Number(e.value)) }),
            name: "Loss",
            type: "scatter",
            mode: "markers",
            marker: {
                color: "rgb(255,0,0)",
            },
            hovertext: sortLoss.map((e) => {
                var text = "<br>Start: " + e.start;
                text = text + "<br>End: " + e.end;
                return text
            }),
            hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
        }

        const lohScatter = {
            x: sortLoh.map((e) => { return (Number(e.block_id)) }),
            y: sortLoh.map((e) => { return (Number(e.value)) }),
            name: "LOH",
            type: "scatter",
            mode: "markers",
            marker: {
                color: "rgb(31,119,180)",
            },
            hovertext: sortLoh.map((e) => {
                var text = "<br>Start: " + e.start;
                text = text + "<br>End: " + e.end;
                return text
            }),
            hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
        }

        const undeterminedScatter = {
            x: sortUndetermined.map((e) => { return (Number(e.block_id)) }),
            y: sortUndetermined.map((e) => { return (Number(e.value)) }),
            name: "Undetermined",
            type: "scatter",
            mode: "markers",
            marker: {
                color: "rgb(77,77,77)",
            },
            hovertext: sortUndetermined.map((e) => {
                var text = "<br>Start: " + e.start;
                text = text + "<br>End: " + e.end;
                return text
            }),
            hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
        }

        return ([gainScatter, lossScatter, lohScatter, undeterminedScatter])
    }

    function exportTable() {
        return [
            {
                columns: columns.map((e) => {
                    return { title: e.label, width: { wpx: 160 } };
                }),
                data: (chromoId>=0? allValue:allValues).map((e) => {
                    return [
                        { value: e.sampleId},
                        { value: e.dataset },
                        { value: e.block_id },
                        { value: e.type },
                        { value: e.value },
                        { value: e.start },
                        { value: e.end },
                        { value: e.ancestry },
                        { value: e.sex },
                        { value: e.age },
                    ];
                }),
            },
        ];
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
        setChromoId(id)
    };

    const handleheightChange = (newHeight) =>{
        setFigureHeight(newHeight+chartHeight)
    }
    const resetHeight = () =>{
        setFigureHeight(chartHeight)
    }
  
    return (
        <Tabs activeKey={tab} onSelect={(e) => setTab(e)} className="mb-3">
            <Tab eventKey="summary" title="Summary">
                <p style={{ textAlign: "center",marginBottom: "0.5rem",fontWeight: 500 }}>Autosomal mCA Distribution</p>
                <div className="row justify-content-center" >
                    <div style={{height:figureHeight,left:10}}>
                        <CirclePlotTest 
                            clickedChromoId={handleClickedChromoId} 
                            key={clickedCounter} 
                            loss={loss} loh={loh} gain={gain} undetermined={undetermined} 
                            chrX={form.chrX} chrY={form.chrY} chrx={chrX} chry={chrY}
                            onHeightChange={handleheightChange} 
                            onResetHeight={resetHeight}
                            >  
                        </CirclePlotTest>
                    </div>
                    <Legend ></Legend>
                </div>
                <Row>
                    <div className="">
                        <div className="d-flex mx-3" style={{ justifyContent: "flex-end" }}>
                            <ExcelFile
                                filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                                element={<a href="javascript:void(0)">Export Data</a>}
                            >
                                <ExcelSheet dataSet={exportTable()} name="Autosomal mCA Distribution" />
                            </ExcelFile>
                        </div>

                        <div className="mx-3">
                            <Table
                                columns={columns}
                                defaultSort={[{ id: "sampleId", asc: true }]}
                                data= {chromoId>=0? allValue:allValues}
                            />
                        </div>
                    </div>
                </Row>
            </Tab>
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
                                    title: "<b>Value</b>",
                                    tickfont: {
                                        size: 14,
                                    },
                                    automargin: true,
                                },
                                scattergap: 0.7,
                                autosize: true,
                                scattermode: "group",
                                tickmode: "linear"
                            }}
                            config={{
                                ...defaultConfig,
                                toImageButtonOptions: {
                                    ...defaultConfig.toImageButtonOptions,
                                    filename: "All_Chromosomes"
                                },
                            }}
                            useResizeHandler
                            className="flex-fill w-100"
                            style={{ height: "700px" }}
                        />
                    </Col>
                </Row>
                <Row>
                    <div className="">
                        <div className="d-flex mx-3" style={{ justifyContent: "flex-end" }}>
                            <ExcelFile
                                filename={"Mosaic_Tiler_Autosomal_mCA_Distribution"}
                                element={<a href="javascript:void(0)">Export Data</a>}
                            >
                                <ExcelSheet dataSet={exportTable()} name="Autosomal mCA Distribution" />
                            </ExcelFile>
                        </div>

                        <div className="mx-3">
                            <Table
                                columns={columns}
                                defaultSort={[{ id: "sampleId", asc: true }]}
                                data={chromoId>=0? allValue:allValues}
                            />
                        </div>
                    </div>
                </Row>
            </Tab>
        </Tabs>
    )
}