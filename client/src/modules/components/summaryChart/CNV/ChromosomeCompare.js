import React, { useEffect, useState, useRef } from "react";
import Plot from "react-plotly.js";
import GenePlot from "./GenePlot";
import SnpPlot from "./SnpPlot";
import { Row, Col, Container } from "react-bootstrap";
import SingleChromosome from "./SingleChromosome";
import "./css/circos.css";

const zoomWindow = 5000000;
function ChromosomeCompare(props) {
  const handleZoomChange = props.handleZoomChange;
  const zoomRangeA = props.zoomRangeA;
  const zoomRangeB = props.zoomRangeB;
  const dataA = props.dataA;
  const dataB = props.dataB;
  const titleA = props.titleA;
  const titleB = props.titleB;
  const detailsA = props.detailsA;
  const detailsB = props.detailsB;
  const chromesomeId = props.chromesomeId;
  const singleFigWidth = props.singleFigWidth;
  const handleCompareHeightChange = props.handleCompareHeightChange;
  const compareCircleSize = props.compareCircleSize;

  const [xMax, setXMax] = useState();
  const [xMin, setXMin] = useState();

  const [loading, setLoading] = useState(false);

  return (
    <>
      <Row className="justify-content-center">
        <Col>
          <div style={{ position: "sticky", top: 0 }}>
            <SingleChromosome
              onZoomChange={handleZoomChange}
              zoomRange={zoomRangeA}
              data={dataA}
              title={titleA}
              details={detailsA}
              chromesomeId={chromesomeId}
              width={singleFigWidth}
              height={singleFigWidth}
              onHeightChange={props.onHeightChange}
              onCompareHeightChange={handleCompareHeightChange}></SingleChromosome>
          </div>
        </Col>
        <Col>
          <div style={{ position: "sticky", top: 0 }}>
            <SingleChromosome
              onZoomChange={handleZoomChange}
              zoomRange={zoomRangeB}
              data={dataB}
              title={titleB}
              details={detailsB}
              chromesomeId={chromesomeId}
              width={singleFigWidth}
              height={singleFigWidth}
              onHeightChange={props.onHeightChange}
              onCompareHeightChange={handleCompareHeightChange}></SingleChromosome>
          </div>
        </Col>
      </Row>
      <br />
      {loading && xMax - xMin < zoomWindow ? (
        <div>
          <SnpPlot
            width={props.width}
            xMax={xMax}
            xMin={xMin}
            chr={props.chromesomeId}
            onHeightChange={props.onHeightChange}></SnpPlot>
          <br></br>
          <GenePlot
            width={props.width}
            xMax={xMax}
            xMin={xMin}
            chr={props.chromesomeId}
            onHeightChange={props.onHeightChange}
            onCompareHeightChange={props.onCompareHeightChange}></GenePlot>
          <br></br>
        </div>
      ) : (
        !props.title && (
          <p style={{ fontSize: "14px" }}>
            Gene and SNP plot are not available at the current zoom level.<br></br>
            Please zoom in to a 5MB range to see genes and SNPs.
          </p>
        )
      )}
      {xMin
        ? "Chr" +
          props.chromesomeId +
          ": " +
          Math.trunc(xMin).toLocaleString("en-US", { style: "decimal" }) +
          " -- " +
          Math.trunc(xMax).toLocaleString("en-US", { style: "decimal" })
        : ""}
    </>
  );
}

export default ChromosomeCompare;
