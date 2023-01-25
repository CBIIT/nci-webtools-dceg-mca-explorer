import { useState } from "react";
import { useRecoilState } from "recoil";
import { formState } from "./explore.state";
import Plot from "react-plotly.js"
import { Tabs, Tab, Row, Col } from "react-bootstrap";

import gain from "../components/summaryChart/CNV/gain.json"
import loss from "../components/summaryChart/CNV/loss.json"
import loh from "../components/summaryChart/CNV/loh.json"

export default function RangeView() {
    const [form, setForm] = useRecoilState(formState);
    const [tab, setTab] = useState("summary");
    console.log(form)
    const chromosomes = form.chromosome.map((e) => e.label)
    

    function getScatterData(){

        const sortGain = gain.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a,b) =>Number(a.block_id) - Number(b.block_id))
        const sortLoss = loss.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a,b) =>Number(a.block_id) - Number(b.block_id))
        const sortLoh = loh.filter((e) => chromosomes.includes(Number(e.block_id))).sort((a,b) =>Number(a.block_id) - Number(b.block_id))

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

        console.log(gainScatter)
        return([gainScatter, lossScatter, lohScatter])
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
            </Tab>
        </Tabs>
    )
}