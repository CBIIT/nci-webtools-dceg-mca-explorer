import { Form, Button, Accordion, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import ComparePanel from "./comparePanel";
import { AncestryOptions, CompareArray, TypeStateOptions } from "./constants";

const compareArray = CompareArray;
export default function ExploreForm({ onSubmit, onReset, onClear, onFilter, isOpen }) {
  const [selectedOption, setSelectedOption] = useState("none");
  //const sample = useRecoilValue(sampleState);
  const [form, setForm] = useState(defaultFormState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const [counter, setCounter] = useState(0);
  //console.log(form)
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const chromosomes = [{ value: "all", label: "All Chromosomes" }]
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

  function handleChange(event) {
    const { name, value } = event.target;
    //console.log(name, value)
    if (name === "chrX") {
      setIsX(event.target.checked);
      mergeForm({ [name]: event.target.checked });
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
    if (onSubmit) onSubmit(form);
    handleDisplayCompare();
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    setIsX(false);
    setIsY(false);
    //setCompare(false);
    if (onReset) onReset(defaultFormState);
    onSubmit(resetFormState, "reset"); //clean the plot
  }

  function handleSelectChange(name, selection = []) {
    //console.log(name, selection);
    if (name === "chromosome" && selection.find((option) => option.value === "all")) {
      selection = chromosomes.slice(1);
    }

    if (name === "types") {
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
    mergeForm({ [name]: selection });
  }

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

  const handlegroupChange = (value, gname) => {
    // console.log("compare group:", value, gname);
    if (gname === "A") setForm({ ...form, groupA: value, compare: true });
    if (gname === "B") setForm({ ...form, groupB: value, compare: true });
  };
  const handleCompareCheckboxChange = (id) => {
    const updatedComparecheck = compareChecks.map((ck) => {
      if (ck.id === id) {
        return { ...ck, isChecked: !ck.isChecked };
      }
      return ck;
    });
    setCompareChecks(updatedComparecheck);
  };
  // useEffect(() => {
  //   setCompare(compare);
  //   setForm({ ...form });
  //   console.log(compare, form);
  // }, [compare]);
  const updateGroup = (group) => {
    console.log(group);
    //if (group === "a") setForm({ ...form, groupA: form.group });
    // else if (group === "b") setForm({ ...form, groupB: form.group });
  };
  const handleDisplayCompare = () => {
    setCompare(true);
  };

  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
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
        <Form.Label className="required">Plot Type</Form.Label>
        <OverlayTrigger
          overlay={
            <Tooltip id="plotType_tooltip">
              Circos plot displays all chromosomes, select Static plot to visualize a subset of chromosomes
            </Tooltip>
          }>
          <Select
            aria-label="plotType"
            placeholder="No plot type selected"
            name="plotType"
            value={form.plotType}
            onChange={(ev) => handleSelectChange("plotType", ev)}
            options={[
              { value: "circos", label: "Circos" },
              { value: "static", label: "Static" },
            ]}
          />
          {/* {isCircos?<Button></Button>} */}
        </OverlayTrigger>
      </Form.Group>
      {form.plotType.value === "static" ? (
        <Form.Group className="mb-3">
          <Form.Label className="required">Chromosome</Form.Label>
          <Select
            aria-label="chromosome"
            placeholder="No chromosome selected"
            name="chromosome"
            isMulti={true}
            value={form.chromosome}
            onChange={(ev) => handleSelectChange("chromosome", ev)}
            options={chromosomes}
          />
        </Form.Group>
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
        <Form.Label className="required">Copy Number State</Form.Label>
        <Select
          aria-label="state"
          placeholder="No types selected"
          name="types"
          isMulti={true}
          value={form.types}
          onChange={(ev) => handleSelectChange("types", ev)}
          options={TypeStateOptions}
        />
      </Form.Group>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Advanced Fields</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3" controlId="array">
              <Form.Label>Genotyping Array</Form.Label>
              <Select
                placeholder="No array selected"
                name="array"
                isMulti={true}
                value={form.array}
                onChange={(ev) => handleSelectChange("array", ev)}
                options={[
                  { value: "gsa", label: "Illumina Global Screening Array" },
                  { value: "oncoArray", label: "Illumina OncoArray Array" },
                ]}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="algorithm">
              <Form.Label>Detection Algorithm</Form.Label>
              <Select
                placeholder="No algorithm selected"
                name="algorithm"
                isMulti={true}
                value={form.algorithm}
                onChange={(ev) => handleSelectChange("algorithm", ev)}
                options={[{ value: "test", label: "Placeholder" }]}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sex">
              <Form.Label>Genotype Sex</Form.Label>
              <Select
                placeholder="No sex selected"
                name="sex"
                isMulti={true}
                value={form.sex}
                onChange={(ev) => handleSelectChange("sex", ev)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                ]}
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
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min age"
                      name="minAge"
                      id="minAge"
                      value={form.minAge}
                      onChange={handleChange}
                    />
                    {/* <InputGroup.Text></InputGroup.Text> */}
                  </InputGroup>
                </Col>
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Max age"
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
                placeholder="No ancestry selected"
                name="ancestry"
                isMulti={true}
                value={form.ancestry}
                onChange={(ev) => handleSelectChange("ancestry", ev)}
                options={AncestryOptions}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cellular Fraction</Form.Label>
              <Row>
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min percentage"
                      name="minFraction"
                      id="minFraction"
                      value={form.minFraction}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Max percentage"
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
                placeholder="No status selected"
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
      <div className="m-3">
        <Button variant="outline-secondary" className="me-1" type="reset">
          Reset
        </Button>
        <OverlayTrigger
          overlay={!isValid() ? <Tooltip id="phos_tumor_val">Missing Required Parameters</Tooltip> : <></>}>
          <Button variant="primary" type="submit" id="summarySubmit" disabled={!isValid()}>
            Submit
          </Button>
        </OverlayTrigger>
      </div>
      <hr></hr>
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
