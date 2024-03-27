import { Form, Button, Accordion, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import ComparePanel from "./comparePanel";
import { AncestryOptions, CompareArray, TypeStateOptions } from "./constants";
import chromolimit from "../components/summaryChart/CNV/layout2.json";

export default function CompareForm({ onSubmit, onReset, onClear, onFilter }) {
  const [selectedOption, setSelectedOption] = useState("none");
  //const sample = useRecoilValue(sampleState);
  const [form, setForm] = useRecoilState(formState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [counter, setCounter] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  // console.log("compareForm:", form);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const chromosomes = []
    .concat(
      Array.from({ length: 22 }, (_, i) => i + 1).map((i) => {
        return { value: "chr" + i, label: i };
      })
    )
    .concat({ value: "chrX", label: "X" })
    .concat({ value: "chrY", label: "Y" });
  const formRef = useRef();
  const [isX, setIsX] = useState(false);
  const [isY, setIsY] = useState(false);
  const initialSelection = CompareArray.map((option) => ({
    ...option,
    //isChecked: form.groupA[option.value] ? true : false,
  }));

  const [compareChecks, setCompareChecks] = useState(initialSelection);
  const [compare, setCompare] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);

  const [showXY, setShowXY] = useState(true)

  function handleChange(event) {
    const { name, value } = event.target;
    console.log(form,name, value)
    if (name === "chrX") {
      setIsX(event.target.checked);
      mergeForm({ [name]: event.target.checked});
    } else if (name === "chrY") {
      setIsY(event.target.checked);
      mergeForm({ [name]: event.target.checked });
     
    }
    // else if(name==="compare" ){
    //   setCompare(event.target.checked)
    //   mergeForm({ [name]: event.target.checked})
    //   onCompare({compare:event.target.checked})
    // }
    else mergeForm({ [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitClicked(true);
    if (onSubmit) onSubmit(form);
    //handleDisplayCompare();
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    setIsX(false);
    setIsY(false);
    setSubmitClicked(false);

    //setCompare(false);
    if (onReset) onReset(defaultFormState);

    //onSubmit(resetFormState, "reset"); //clean the plot
  }

  function handleSelectChange(name, selection = []) {
     console.log(name, selection);
    if (name === "chrCompare") {
      const selectedChromo = chromolimit.filter((c) => c.id === selection.label + "");
      setEnd(selectedChromo[0].len + "");
      setStart(0);
      //handleFilterClear()
 
    /*  onClear({
        ...form,
        plotType:{ value:"static",label:"Chromosome level", },
        //groupA: [],
        //groupB: [],
        groupA: { study: [{ value: "plco", label: "PLCO" }], types: [{ value: "all", label: "All Event Types" }] },
        groupB: { study: [{ value: "plco", label: "PLCO" }], types: [{ value: "all", label: "All Event Types" }] },
        //counterCompare: counter + 1,
      });*/
    
    }

    if (name === "types" || name === "ancestry" || name === "sex" || name === "approach") {
      const all = selection.find((option) => option.value === "all");
      const allindex = selection.indexOf(all);
      //if all selected, then another option select, remove all
      //if other option selected, and select all again, then remove other, keep all
      if (allindex == 0 && selection.length > 1) {
        selection.splice(allindex, 1);
      } else if (allindex > 0 && selection.length > 1) {
        selection = [all];
      }
    }

    if (name === "study" && selection.find((option) => option.value === "all")) {
      selection = [
        { value: "plco", label: "PLCO" },
        { value: "ukbb", label: "UK Bio Bank" },
      ];
    }
    // if (name === "plotType") {

    // }

    mergeForm({ [name]: selection });
  }

  useEffect(() => {
    setForm({ ...form, end: end, start: start });
  }, [end, start]);
  // avoid loading all samples as Select options
  function filterSamples(value, limit = 100) {}

  function isValid() {
    if (form.plotType.value === "static" && form.chromosome.length === 0) return false;

    if (form.chromosome.length === 1) {
      if (!form.start || !form.end) return false;

      if (Number(form.start) < 0 || Number(form.end < 0) || Number(form.start) > Number(form.end)) return false;
    }

    if (form.minFraction) {
      if (!form.maxFraction || Number(form.maxFraction) <= Number(form.minFraction)) return false;
    } else if (form.maxFraction) {
      if (!form.minFraction || Number(form.maxFraction) <= Number(form.minFraction)) return false;
    }
    return form.study && form.types;
  }
  //console.log(form)
  function handleFilter(event) {
    event.preventDefault();
    setSubmitClicked(true);
    //setCounter(counter + 1);
    //mergeForm({ compare: true });
    //onCompare({ compare: true });
    //update the compare variable and run the filter function to do compare

    if (form.plotType.value !== "static" || (form.plotType.value === "static" && form.chrCompare !== "")) {
      console.log("comparing...");
      setForm({ ...form, compare: true, counterCompare: counter + 1 });
      onFilter({ ...form });
    }
    //onSubmit(form);
  }

  const handleFilterClear = (event) => {
    console.log("filterclear", form);
    setSubmitClicked(false);
    setCompareChecks(CompareArray);
    updateGroup();
    setIsX(false);
    setIsY(false);
    onClear({
      ...form,
      //groupA: [],
      //groupB: [],
      groupA: { study: [{ value: "plco", label: "PLCO" }], types: [{ value: "all", label: "All Event Types" }] },
      groupB: { study: [{ value: "plco", label: "PLCO" }], types: [{ value: "all", label: "All Event Types" }] },
      //counterCompare: counter + 1,
    });
    //clear all reset
    // const resetBtns = document.querySelectorAll('a[data-val*="reset"]');
    // if (resetBtns !== undefined) {
    //   for (let i = 0; i < resetBtns.length; i++) {
    //     resetBtns[i].click();
    //     resetBtns[i].click();

    //   }
    // }
    const resetBtn = document.getElementById("clearCompare");
    resetBtn.click();

    //onFilter({ ...form, compare: true, counterCompare: counter + 1 });
  };

  const handlegroupChange = (value, gname) => {
    console.log("compare group:", value, gname);
    if (value !== undefined) {
      if (gname === "A") setForm((prevForm) => ({ ...prevForm, groupA: value }));
      else if (gname === "B") setForm((prevForm) => ({ ...prevForm, groupB: value }));
    }
    console.log(form)
  };
  const handleCompareCheckboxChange = (id) => {
    const updatedComparecheck = compareChecks.map((ck) => {
      if (ck.id === id) {
        return { ...ck, isChecked: !ck.isChecked };
      }
      return ck;
    });
    //updatedComparecheck.sort((a, b) => a.order - b.order);

    setCompareChecks(updatedComparecheck);
  };

  const updateGroup = () => {
    setResetCounter((prevCounter) => prevCounter + 1);
  };
  const handleDisplayCompare = () => {
    setCompare(true);
  };
 
  const handleShowXY = (val) =>{
    setShowXY(val)
  }
  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
      <Form.Group className="mb-3">
        <Form.Group className="mb-3">
          <Form.Label className="required">Plot Type</Form.Label>
          <OverlayTrigger
            overlay={
              <Tooltip id="plotType_tooltip">
                All chromosomes plot displays all chromosomes, select chromosome level plot to visualize a subset of
                chromosomes
              </Tooltip>
            }>
            <Select
              aria-label="plotType"
              placeholder="- Select -"
              name="plotType"
              value={form.plotType}
              onChange={(ev) => handleSelectChange("plotType", ev)}
              options={[
                { value: "circos", label: "All chromosomes" },
                { value: "static", label: "Chromosome level" },
              ]}
            />
            {/* {isCircos?<Button></Button>} */}
          </OverlayTrigger>
        </Form.Group>
        {form.plotType.value === "static" ? (
          <>
            <Form.Group className="mb-3">
              <Form.Label className="required">Chromosome</Form.Label>
              <Form.Label style={{ color: "red" }}>
                {submitClicked && form.chrCompare === "" ? "Plese select chromosome" : ""}
              </Form.Label>
              <Select
                aria-label="chromosome"
                placeholder="- Select -"
                name="chromosome"
                isMulti={false}
                value={form.chrCompare}
                onChange={(ev) => handleSelectChange("chrCompare", ev)}
                options={chromosomes}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Range</Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Start"
                      name="start"
                      id={"Start"}
                      value={form.start}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Col>
                <Col xl={2}>__</Col>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control placeholder="End" name="end" id={"end"} value={form.end} onChange={handleChange} />
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          </>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label className="">Include Chromosome</Form.Label>
            <Form.Check
              ref={formRef}
              type="checkbox"
              inline
              label="X"
              name="chrX"
              id={`inline-X-1`}
              onChange={handleChange}
              checked={isX}
              disabled={!showXY}
            />
            <Form.Check
              type="checkbox"
              inline
              label="Y"
              name="chrY"
              id={`inline-Y-2`}
              onChange={handleChange}
              checked={isY}
              disabled={!showXY}
            />
          </Form.Group>
        )}
        <hr></hr>
        <Accordion style={{ paddingTop: "5px" }}>
          <Accordion.Item eventKey="0">
            <Accordion.Header eventKey="0" style={{ textAlign: "right" }}>
              Choose more attributes
            </Accordion.Header>
            <Accordion.Body
              style={{
                backgroundColor: "white",
                border: "thin solid #dcdcdc",
                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                padding: "10px",
              }}>
              <Form.Label></Form.Label>
              <Card>
                {compareChecks.map((ck) => {
                  //do not display study and types in the selection panel
                  //if plot type is circos, do not show range option
                  if (
                    ck.value !== "study" &&
                    ck.value !== "types" &&
                    ck.value !== "range" &&
                    (form.plotType.value === "circos" ? ck.value !== "range" : true)
                  ) {
                    //if plot type is circus, then do not display range
                    return (
                      <div key={ck.id}>
                        <label>
                          <input
                            type="checkbox"
                            checked={ck.isChecked}
                            onChange={() => handleCompareCheckboxChange(ck.id)}
                          />
                          {ck.label}
                        </label>
                      </div>
                    );
                  } else return null;
                })}
              </Card>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <br></br>
        <ComparePanel
          id="groupA"
          compareItem={compareChecks}
          name="A"
          onCompareChange={handlegroupChange}
          isX = {isX}
          isY= {isY}
          setShowXY = {handleShowXY}
          onReset={resetCounter}></ComparePanel>
        <br></br>
        <ComparePanel
          id="groupB"
          compareItem={compareChecks}
          name="B"
          onCompareChange={handlegroupChange}
          isX = {isX}
          isY= {isY}
          setShowXY = {handleShowXY}
          onReset={resetCounter}></ComparePanel>

        <br></br>
        <div className="m-3" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Button
            variant="outline-secondary"
            className="me-3"
            type="button"
            id="clearCompare"
            onClick={handleFilterClear}>
            Reset
          </Button>
          <Button variant="primary" className="me-1" type="button" id="compareSubmit" onClick={handleFilter}>
            Submit
          </Button>
        </div>
      </Form.Group>
    </Form>
  );
}
