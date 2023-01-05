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
import CircleChart from "../components/summaryChart/CNV/CirclePlot";
import {
  SidebarContainer,
  SidebarPanel,
  MainPanel,
} from "../components/sidebar-container";
import { useExternalScript } from "./useExternalScript";

export default function Explore() {
  const [form, setForm] = useRecoilState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  // const circle = document.getElementById("NGCircos")
  // const currentPath = (window.location.href);
  // console.log(currentPath)
  // if (!currentPath.includes("about")){
  //   circle.style.display = "show"
  // }
  
  //const externalScript = "../components/summaryChart/CNV/cnv.html";
  //const statechart = useExternalScript(externalScript);

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
                    <CircleChart></CircleChart>
                     {/* <div dangerouslySetInnerHTML={{__html: CircleChart}} /> */}
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
