import { Suspense, useEffect, useState, Text } from "react";
import { useRecoilState } from "recoil";
import {Button, OverlayTrigger, Container, Row, Col, Card } from "react-bootstrap";

import ExploreForm from "./explore-form";
import ErrorBoundary from "../components/error-boundary";
import { formState } from "./explore.state";
//import CircleChart from "../components/summaryChart/CNV/CirclePlot";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest"
import RangeView from "./rangeView";
//import StackTest from "../components/summaryChart/CNV/StackTest"
import {
  SidebarContainer,
  SidebarPanel,
  MainPanel,
} from "../components/sidebar-container";

export default function Explore() {
  const [form, setForm] = useRecoilState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  
  useEffect(() => {
    _setOpenSidebar(form.openSidebar);
  }, [form.openSidebar]);

  function handleSubmit(event) {
    setForm({ ...event, submitted: true });
    console.log("submit", event);
  }

  function handleReset(event) {
    setForm(event);
    console.log("reset", event);
  }

  function results() {
    return "test";
  }

  return (
    <Container className="my-4">
      <SidebarContainer
        collapsed={!_openSidebar}
        onCollapsed={(collapsed) => mergeForm({ ["openSidebar"]: !collapsed })}>
        <SidebarPanel>
          <Card className="shadow">
            <Card.Body>
              <ExploreForm onSubmit={handleSubmit}/>
            </Card.Body>
          </Card>

        </SidebarPanel>
        <MainPanel>
          <Card className="shadow h-100 mb-5 align-self-center">
            <Card.Body className="p-0">
              <ErrorBoundary
                fallback={
                  <div style={{ color: "red" }}>
                    The server encountered an internal error or
                    misconfiguration. Please contact{" "}
                    <a href="mailto:NCImosaicTilerWebAdmin@mail.nih.gov">
                      NCImosaicTilerWebAdmin@mail.nih.gov
                    </a>{" "}
                    and inform them your configuration settings and the time
                    that the error occured.{" "}
                  </div>
                }>
                <Suspense fallback="Loading...">
                  {form.submitted ? (
                    <RangeView/>
                  ) : (
                    <>
                      <h2 style={{ textAlign: "center", padding: "20px" }}>Autosomal mCA Distribution</h2>
                      <div className="row">
                        <div className="col-1"></div>
                        <div className="col-10">
                          <CirclePlotTest></CirclePlotTest>
                          <svg version="1.1" baseProfile="full"
                            width="800" height="250"
                            xlmns="http://www/w3/org/2000/svg">
                            <rect x={275} y={20} fill="green" width={50} height={25} />
                            <rect x={350} y={20} fill="blue" width={50} height={25} />
                            <rect x={425} y={20} fill="red" width={50} height={25} />
                            <rect x={500} y={20} fill="grey" width={50} height={25} />
                            <text textAnchor="middle" x="300" y="60">GAIN</text>
                            {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
                            <text textAnchor="middle" x="375" y="60">NEUTRAL</text>
                            {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
                            <text textAnchor="middle" x="450" y="60">LOSS</text>
                            <text textAnchor="middle" x="540" y="60">UNDETERMINED</text>
                            {/* <text textAnchor="middle" x="475" y="80">(576)</text> */}
                          </svg>
                        </div>
                      </div>

                      {/* <CircleChart></CircleChart> */}
                      {/* <CircleChart className="mw-100" style={{ maxHeight: "800px" }}></CircleChart> */}
                    </>
                  )}
                </Suspense>
              </ErrorBoundary>
            </Card.Body>
          </Card>
        </MainPanel>
      </SidebarContainer>
    </Container>
  );
}
