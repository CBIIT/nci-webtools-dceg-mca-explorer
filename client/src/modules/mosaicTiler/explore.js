import { Suspense, useEffect, useState, Text } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingState } from "./explore.state";
import { Button, OverlayTrigger, Container, Row, Col, Card } from "react-bootstrap";

import ExploreForm from "./explore-form";
import ErrorBoundary from "../components/error-boundary";
import { formState } from "./explore.state";

import RangeView from "./rangeView";
import Loader from "../components/loader"
//import StackTest from "../components/summaryChart/CNV/StackTest"
import {
  SidebarContainer,
  SidebarPanel,
  MainPanel,
} from "../components/sidebar-container";

export default function Explore() {
  const [form, setForm] = useRecoilState(formState);
  const loading = useRecoilValue(loadingState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  const [counter,setCounter] =useState(0)
  useEffect(() => {
    _setOpenSidebar(form.openSidebar);
  }, [form.openSidebar]);

  useEffect(() => {
    setCounter(form.counterSubmitted)
  });

  function handleSubmit(event) {
    setForm({ ...event, submitted: true, counterSubmitted:counter+1 });
    //console.log("submit",  form.counterSubmitted);
  }
  function handleFilter(event) {
    setForm({ ...event,submitted: true,counterSubmitted:form.counterSubmitted});
    //console.log("Filter: ", form.counterSubmitted)
  }
  function handleCompare(event) {
    setForm({...form,compare:event.compare});
    //console.log(event)
  }

  function handleReset(event) {
    setForm(event);
    console.log("reset", event);
  }

  function results() {
    return "test";
  }

  return (
    <Container className="my-3">
      <Loader fullscreen show={loading} />
      <SidebarContainer
        collapsed={!_openSidebar}
        onCollapsed={(collapsed) => mergeForm({ ["openSidebar"]: !collapsed })}>
        <SidebarPanel>
          <Card className="shadow">
            <Card.Body>
              <ExploreForm onSubmit={handleSubmit} onCompare={handleCompare} onFilter={handleFilter} />
            </Card.Body>
          </Card>
        </SidebarPanel>
        <MainPanel>
          <div className="h-100 mb-5 align-self-center">
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
                    <RangeView />
                  ) : (
                    <div className="m-2">
                      Please provide configuration settings on
                      the left panel and click Submit.
                    </div>
                  )}
                </Suspense>
              </ErrorBoundary>
            </Card.Body>
          </div>
        </MainPanel>
      </SidebarContainer>
    </Container>
  );
}
