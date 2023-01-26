import { useState } from "react";
import { useRecoilState } from "recoil";
import { formState } from "./explore.state";
import Plot from "react-plotly.js"
import { Tabs, Tab, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import { ExcelFile, ExcelSheet } from "../components/excel-export";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest"

import gain from "../components/summaryChart/CNV/gain.json";
import loss from "../components/summaryChart/CNV/loss.json";
import loh from "../components/summaryChart/CNV/loh.json";
import unknown from "../components/summaryChart/CNV/unknown.json";
import Table from "../components/table";

export default function RangeView() {
    const [form, setForm] = useRecoilState(formState);
    const [tab, setTab] = useState("summary");
    console.log(form)
    const chromosomes = form.chromosome.map((e) => e.label)

    const sortGain = gain.filter((e) => chromosomes.includes(Number(e.block_id))).map((e) => { return ({ ...e, "type": "Gain" }) }).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortLoss = loss.filter((e) => chromosomes.includes(Number(e.block_id))).map((e) => { return ({ ...e, "type": "Loss" }) }).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortLoh = loh.filter((e) => chromosomes.includes(Number(e.block_id))).map((e) => { return ({ ...e, "type": "LOH" }) }).sort((a, b) => Number(a.block_id) - Number(b.block_id))
    const sortUnknown = unknown.filter((e) => chromosomes.includes(Number(e.block_id))).map((e) => { return ({ ...e, "type": "Unknown" }) }).sort((a, b) => Number(a.block_id) - Number(b.block_id))

    const allValues = sortGain.concat(sortLoss).concat(sortLoh).concat(sortUnknown)

    const columns = [
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
            label: "Value",
            Header: <b>Value</b>
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

        const unknownScatter = {
            x: sortUnknown.map((e) => { return (Number(e.block_id)) }),
            y: sortUnknown.map((e) => { return (Number(e.value)) }),
            name: "Unknown",
            type: "scatter",
            mode: "markers",
            marker: {
                color: "rgb(77,77,77)",
            },
            hovertext: sortUnknown.map((e) => {
                var text = "<br>Start: " + e.start;
                text = text + "<br>End: " + e.end;
                return text
            }),
            hovertemplate: "<br>Value: %{y} %{hovertext} <extra></extra>",
        }

        console.log(gainScatter)
        return ([gainScatter, lossScatter, lohScatter, unknownScatter])
    }

    function exportTable() {
        return [
            {
                columns: columns.map((e) => {
                    return { title: e.label, width: { wpx: 160 } };
                }),
                data: allValues.map((e) => {
                    return [
                        { value: e.block_id },
                        { value: e.type },
                        { value: e.value },
                        { value: e.start },
                        { value: e.end },
                        { value: e.ancestry },
                        { value: e.sex },
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
    return (
        <Tabs activeKey={tab} onSelect={(e) => setTab(e)} className="mb-3">
            <Tab eventKey="summary" title="Summary">
                <h2 style={{ textAlign: "center", padding: "20px" }}>Autosomal mCA Distribution</h2>
                <div className="row justify-content-center">

                    <CirclePlotTest></CirclePlotTest>
                    <div className="text-center">
                        <svg version="1.1" baseProfile="full"
                            width="700" height="100"
                            xlmns="http://www/w3/org/2000/svg">
                            <rect x={200} y={20} fill="green" width={50} height={25} />
                            <rect x={275} y={20} fill="blue" width={50} height={25} />
                            <rect x={350} y={20} fill="red" width={50} height={25} />
                            <rect x={425} y={20} fill="grey" width={50} height={25} />
                            <text textAnchor="middle" x="225" y="60">GAIN</text>
                            {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
                            <text textAnchor="middle" x="300" y="60">NEUTRAL</text>
                            {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
                            <text textAnchor="middle" x="375" y="60">LOSS</text>
                            <text textAnchor="middle" x="450" y="60">UNKNOWN</text>
                            {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
                        </svg>
                    </div>

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
                                defaultSort={[{ id: "chromosome", asc: true }]}
                                data={allValues}
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
                                defaultSort={[{ id: "chromosome", asc: true }]}
                                data={allValues}
                            />
                        </div>
                    </div>
                </Row>
            </Tab>
        </Tabs>
    )
}