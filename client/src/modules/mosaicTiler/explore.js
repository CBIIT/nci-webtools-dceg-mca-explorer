import { Suspense, useEffect, useState, Text } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingState } from "./explore.state";
import { Container, Card, Tabs, Tab, FormCheck } from "react-bootstrap";

import ExploreForm from "./explore-form";
import CompareForm from "./compare-form";
import ErrorBoundary from "../components/error-boundary";
import { formState, defaultFormState } from "./explore.state";

import RangeView from "./rangeView";
import Loader from "../components/loader";
//import StackTest from "../components/summaryChart/CNV/StackTest"
import { SidebarContainer, SidebarPanel, MainPanel } from "../components/sidebar-container";

export default function Explore() {
  const [form, setForm] = useRecoilState(formState);
  const loading = useRecoilValue(loadingState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const [_openSidebar, _setOpenSidebar] = useState(true);
  const [counter, setCounter] = useState(0);
  const [isOpenCompare, setIsOpenCompare] = useState(false);
  const [clear, setClear] = useState(0);

  useEffect(() => {
    _setOpenSidebar(form.openSidebar);
  }, [form.openSidebar]);

  useEffect(() => {
    setCounter(form.counterSubmitted);
  });

  function handleSubmit(event, name) {
    // setIsOpenCompare(true);
    setForm({
      ...event,
      submitted: true,
      compare: false,
      counterSubmitted: name === undefined ? counter + 1 : 0,
    });
  }
  function handleFilter(event) {
    console.log("filter:", event, form);
    setForm({
      ...form,
      compare: true,
      counterCompare: form.counterCompare + 1,
      groupA: { ...event.groupA },
      groupB: { ...event.groupB },
      //submitted: true,
    });
  }
  function handleFilterClear(event) {
    setForm({ ...event });
    setClear(clear + 1);

    console.log("filterclear", event);
    //setForm({ ...event, submitted: false });
  }
  useEffect(() => {
    setForm({
      ...defaultFormState,
      submitted: false,
      groupA: { study: [{ value: "plco", label: "PLCO" }] },
      groupB: { study: [{ value: "plco", label: "PLCO" }] },
      // groupA: [],
      // groupB: [],
      counterCompare: 0,
    });
    console.log("clear...", form);
  }, [clear]);

  function handleReset(event) {
    //setForm(event);
    setForm(defaultFormState);
    console.log("reset", form);
  }

  function handleClick(value) {
    //setIsOpenCompare(true);
    //console.log("in explore", value, form);
  }
  function handleCheckboxChange() {
    setIsOpenCompare(!isOpenCompare);
    //const tabs = document.querySelectorAll("[role=tabpanel");
    //console.log("click pair");
    // if (isOpenCompare) {
    //   console.log(tabs);
    // }
    setForm({ ...form, compare: !isOpenCompare });
    setForm(defaultFormState);
    // if (Array.isArray(form.groupA)) {
    //   const combtn = document.getElementById("compareSubmit");
    //   if (combtn !== null) combtn.click();
    // }
  }

  return (
    <Container className="my-3">
      <Loader fullscreen show={loading} />
      <SidebarContainer
        collapsed={!_openSidebar}
        onCollapsed={(collapsed) => mergeForm({ ["openSidebar"]: !collapsed })}>
        <SidebarPanel>
          <Card>
            <label
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                padding: 10,
                paddingBottom: 0,
              }}>
              <input id="paircheck" type="checkbox" checked={isOpenCompare} onChange={handleCheckboxChange}></input>
              <span style={{ marginLeft: "10px" }}>Pair Comparison</span>
            </label>
            {!isOpenCompare ? (
              <Card className="shadow" id="summary">
                <Card.Body>
                  <ExploreForm
                    onSubmit={handleSubmit}
                    onFilter={handleFilter}
                    onClear={handleFilterClear}
                    isOpen={isOpenCompare}
                    onReset={handleReset}
                    onFilterClear
                  />
                </Card.Body>
              </Card>
            ) : (
              <Card className="shadow">
                <Card.Body>
                  <CompareForm
                    onSubmit={handleSubmit}
                    onFilter={handleFilter}
                    onClear={handleFilterClear}
                    onReset={handleReset}
                    isOpen={isOpenCompare}
                  />
                </Card.Body>
              </Card>
            )}
          </Card>
        </SidebarPanel>
        <MainPanel>
          <div className="h-100 mb-5 align-self-center">
            <Card.Body className="p-0">
              <ErrorBoundary
                fallback={
                  <div style={{ color: "red" }}>
                    The server encountered an internal error or misconfiguration. Please contact{" "}
                    <a href="mailto:NCImcaExplorerWebAdmin@mail.nih.gov">NCImcaExplorerWebAdmin@mail.nih.gov</a> and
                    inform them your configuration settings and the time that the error occured.{" "}
                  </div>
                }>
                <Suspense fallback="Loading...">
                  {form.submitted ? (
                    <RangeView handleClick={handleClick} onPair={handleCheckboxChange} />
                  ) : form.compare ? (
                    <RangeView handleClick={handleClick} onPair={handleCheckboxChange} />
                  ) : (
                    <div className="m-2">Please provide configuration settings on the left panel and click Submit.</div>
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
