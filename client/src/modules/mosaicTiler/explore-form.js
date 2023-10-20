import { Form, Button, Accordion, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import ComparePanel from "./comparePanel";
import { AncestryOptions, CompareArray, TypeStateOptions, SexOptions } from "./constants";
import chromolimit from "../components/summaryChart/CNV/layout2.json";

const compareArray = CompareArray;
export default function ExploreForm({ onSubmit, onReset, onClear, onFilter, isOpen }) {
  const [selectedOption, setSelectedOption] = useState("none");
  //const sample = useRecoilValue(sampleState);
  const [form, setForm] = useRecoilState(formState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [counter, setCounter] = useState(0);
  // console.log("exploreform:", form);
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
  const [compareChecks, setCompareChecks] = useState(compareArray);
  const [compare, setCompare] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    // console.log(event, name, value);

    if (name === "chrX") {
      setIsX(event.target.checked);
      mergeForm({ [name]: event.target.checked });
    } else if (name === "chrY") {
      setIsY(event.target.checked);
      mergeForm({ [name]: event.target.checked });
    }
    //if(name === )
    else mergeForm({ [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (onSubmit) onSubmit(form);
    //handleDisplayCompare();
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    setIsX(false);
    setIsY(false);
    //setCompare(false);
    if (onReset) onReset(defaultFormState);
    // onSubmit(resetFormState, "reset"); //clean the plot
  }

  function handleSelectChange(name, selection = []) {
    //console.log(name, selection);
    if (name === "types" || name === "ancestry" || name === "sex") {
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

    if (name === "chrSingle") {
      const selectedChromo = chromolimit.filter((c) => c.id === selection.label + "");
      setEnd(selectedChromo[0].len + "");
      setStart(0);
    }

    if (name === "plotType") {
      // if (selection.value === "circos") {
      //   setEnd("");
      //   setStart("");
      // }
      // if (selection.value === "static") {
      //   if (form.chrSingle !== "") setEnd(chromolimit.filter((c) => c.id === form.chrSingle.label + "")[0].len);
      //   setStart(0);
      // }
    }

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
    //setCounter(counter + 1);
    //mergeForm({ compare: true });
    //onCompare({ compare: true });
    //update the compare variable and run the filter function to do compare
    //setForm({ ...form, compare: true, counterCompare: counter + 1 });
    onFilter({ ...form });
    //onSubmit(form);
  }

  const handleFilterClear = (event) => {
    console.log("filterclear");
    setCompareChecks(compareArray);

    onClear({ ...form, groupA: [], groupB: [], counterCompare: counter + 1 });
    const resetBtns = document.querySelectorAll('a[data-val*="reset"]');
    if (resetBtns !== undefined) {
      for (let i = 0; i < resetBtns.length; i++) {
        resetBtns[i].click();
      }
    }

    //onFilter({ ...form, compare: true, counterCompare: counter + 1 });
  };

  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
      <Form.Group className="mb-3">
        <Form.Label className="required">Plot Type</Form.Label>
        <OverlayTrigger
          overlay={
            <Tooltip id="plotType_tooltip">
              All chromosomes displays all chromosomes, select chromosome level plot to visualize a single chromosome
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
            <Select
              aria-label="chromosome"
              placeholder="- Select -"
              name="chromosome"
              isMulti={false}
              value={form.chrSingle}
              onChange={(ev) => handleSelectChange("chrSingle", ev)}
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
                    id={"ChrStart"}
                    value={form.start}
                    onChange={handleChange}
                  />
                  {/* <InputGroup.Text>%</InputGroup.Text> */}
                </InputGroup>
              </Col>
              __
              <Col xl={6}>
                <InputGroup>
                  <Form.Control placeholder="End" name="end" id="Chrend" value={form.end} onChange={handleChange} />
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
          />
          <Form.Check
            type="checkbox"
            inline
            label="Y"
            name="chrY"
            id={`inline-Y-2`}
            onChange={handleChange}
            checked={isY}
          />
        </Form.Group>
      )}
      <Form.Group className="mb-3">
        <Form.Label className="required">Study</Form.Label>
        <Select
          aria-label="study"
          placeholder="No study selected"
          name="study"
          isMulti={true}
          value={form.study}
          onChange={(ev) => handleSelectChange("study", ev)}
          options={[
            { value: "all", label: "All Studies" },
            { value: "plco", label: "PLCO" },
            { value: "ukbb", label: "UK Biobank" },
          ]}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="required">Copy Number State</Form.Label>
        <Select
          aria-label="state"
          placeholder="- Select -"
          name="types"
          isMulti={true}
          value={form.types}
          onChange={(ev) => handleSelectChange("types", ev)}
          options={TypeStateOptions}
        />
      </Form.Group>

      <Accordion>
        {/* <Accordion.Item eventKey="0"> */}

        <Accordion.Item eventKey="0">
          <Accordion.Header eventKey="0" style={{ textAlign: "right" }}>
            Advanced settings
          </Accordion.Header>
          <Accordion.Body
            style={{
              backgroundColor: "white",
              border: "thin solid #dcdcdc",
              boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              padding: "10px",
            }}>
            <Form.Group className="mb-3" controlId="array">
              <Form.Label>Genotyping Array</Form.Label>
              <Select
                placeholder="- Select -"
                name="array"
                isMulti={true}
                value={form.array}
                onChange={(ev) => handleSelectChange("array", ev)}
                options={[
                  { value: "gsa", label: "Illumina Global Screening" },
                  { value: "oncoArray", label: "Illumina OncoArray" },
                ]}
                classNamePrefix="select"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="algorithm">
              <Form.Label>Detection Algorithm</Form.Label>
              <Select
                placeholder="- Select -"
                name="algorithm"
                isMulti={true}
                value={form.algorithm}
                onChange={(ev) => handleSelectChange("algorithm", ev)}
                options={[{ value: "test", label: "Algorithm" }]}
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sex">
              <Form.Label>Genotype Sex</Form.Label>
              <Select
                placeholder="- Select -"
                name="sex"
                isMulti={true}
                value={form.sex}
                onChange={(ev) => handleSelectChange("sex", ev)}
                options={SexOptions}
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              {/* <Form.Control
                placeholder="No age selected"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              /> */}
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min"
                      name="minAge"
                      id="minAge"
                      value={form.minAge}
                      onChange={handleChange}
                    />
                    {/* <InputGroup.Text></InputGroup.Text> */}
                  </InputGroup>
                </Col>
                __
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Max"
                      name="maxAge"
                      id="maxAge"
                      value={form.maxAge}
                      onChange={handleChange}
                    />
                    {/* <InputGroup.Text></InputGroup.Text> */}
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="ancestry">
              <Form.Label>Ancestry</Form.Label>
              <Select
                placeholder="- Select -"
                name="ancestry"
                isMulti={true}
                value={form.ancestry}
                onChange={(ev) => handleSelectChange("ancestry", ev)}
                options={AncestryOptions}
                classNamePrefix="select"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cellular Fraction</Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min"
                      name="minFraction"
                      id="minFraction"
                      value={form.minFraction}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
                __
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Max"
                      name="maxFraction"
                      id="maxFraction"
                      value={form.maxFraction}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
            <Form.Group className="mb-3" controlId="smoking">
              <Form.Label>Smoking Status</Form.Label>
              <Select
                placeholder="- Select -"
                name="smoking"
                isMulti={true}
                value={form.smoking}
                onChange={(ev) => handleSelectChange("smoking", ev)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      <div className="m-3" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Button variant="outline-secondary" className="me-3" type="reset">
          Reset
        </Button>
        {/* <OverlayTrigger overlay={!isValid() ? <Tooltip id="config_val">Missing Required Parameters</Tooltip> : <></>}> */}
        {/* <Button variant="primary" type="submit" id="summarySubmit" disabled={!isValid()}> */}
        <Button variant="primary" type="submit" id="summarySubmit">
          Submit
        </Button>
        {/* </OverlayTrigger> */}
      </div>
      {/* {isOpen && (
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header style={{ backgroundColor: "#343a40" }}>Compare Group</Accordion.Header>
            <Accordion.Body>
              <Card.Body>
                <Form.Label>Please choose attributes to compare:</Form.Label>
                {compareChecks.map((ck) => (
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
                ))}
                <br></br>

                <ComparePanel compareItem={compareChecks} name="A" onCompareChange={handlegroupChange}></ComparePanel>
                <br></br>

                <ComparePanel compareItem={compareChecks} name="B" onCompareChange={handlegroupChange}></ComparePanel>
              </Card.Body>
              <Card.Body>
                <Row>
                  <Col>
                    <Button
                      variant="outline-secondary"
                      className="me-1"
                      type="button"
                      id="clearCompare"
                      onClick={handleFilterClear}>
                      Reset
                    </Button>
                    <Button variant="primary" className="me-1" type="button" id="compareSubmit" onClick={handleFilter}>
                      Compare
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )} */}
    </Form>
  );
}
