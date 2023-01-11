import { Suspense, useEffect, useState, Text } from "react";
import { useRecoilState } from "recoil";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import ExploreForm from "./explore-form";
import ErrorBoundary from "../components/error-boundary";
import { formState } from "./explore.state";
import SelectionPane from "../components/accordion"
//import CircleChart from "../components/summaryChart/CNV/CirclePlot";
import CirclePlotTest from "../components/summaryChart/CNV/CirclePlotTest"
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
            <SelectionPane></SelectionPane>
            </Card.Body>
          </Card>
           <div className="text-end">
            <Button variant="outline-secondary" className="me-1" type="reset">
              Reset
            </Button>
            <Button variant="primary" type="submit" >
                Submit
           </Button>
            
      </div>
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
                    results()
                  ) : (
                    <>
                    <h2 style={{textAlign: "center", padding:"20px"}}>Autosomal mCA Distribution</h2>
                    <div className="row">
                      <div className="col-1"></div>
                      <div className="col-10">
                        <CirclePlotTest></CirclePlotTest>
                        <svg version="1.1" baseProfile="full" 
                              width="800" height="250" 
                              xlmns="http://www/w3/org/2000/svg">
                              <rect x={300} y={20} fill="green" width={50} height={25} />
                              <rect x={375} y={20} fill="blue" width={50} height={25} />
                              <rect x={450} y={20} fill="red" width={50} height={25} />
                              <text textAnchor="middle" x="325" y="60">GAIN</text>
                              {/* <text textAnchor="middle" x="325" y="80"> (503)</text> */}
                              <text textAnchor="middle" x="400" y="60">CN-LOH</text>
                              {/* <text textAnchor="middle" x="400" y="80">(927)</text> */}
                              <text textAnchor="middle" x="475" y="60">LOSS</text>
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
