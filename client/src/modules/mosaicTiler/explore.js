import { Suspense, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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
        </SidebarPanel>
        <MainPanel>
          <Card className="shadow h-100">
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
                    <CirclePlotTest></CirclePlotTest>
                  <svg version="1.1" baseProfile="full" 
                        width="400" height="250" 
                        xlmns="http://www/w3/org/2000/svg">
                        <rect x={50} y={50} fill="green" width={50} height={25} />
                        <rect x={100} y={50} fill="blue" width={50} height={25} />
                        <rect x={150} y={50} fill="red" width={50} height={25} />
                        <text textAnchor="middle" x="75" y="90">GAIN</text>
                        <text textAnchor="middle" x="125" y="90">LOH</text>
                        <text textAnchor="middle" x="170" y="90">LOSS</text>
       
                  </svg>
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
