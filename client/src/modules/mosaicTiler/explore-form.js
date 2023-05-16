import { Form, Button, Accordion, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import ComparePanel from "./comparePanel";

export default function ExploreForm({ onSubmit, onReset, onCompare, onFilter }) {
  const [selectedOption, setSelectedOption] = useState("none");
  //const sample = useRecoilValue(sampleState);
  const [form, setForm] = useState(defaultFormState);
  const [loading, setLoading] = useRecoilState(loadingState);
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
  const [compareChecks, setCompareChecks] = useState([
    { id: 1, label: "Study", isChecked: false },
    { id: 2, label: "Genotype Array", isChecked: false },
    { id: 3, label: "Genotype Sex", isChecked: false },
    { id: 4, label: "Age", isChecked: false },
    { id: 5, label: "Ancestry", isChecked: false },
  ]);
  const [compare, setCompare] = useState(false);
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);

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
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    setIsX(false);
    setIsY(false);
    //setCompare(false);
    if (onReset) onReset(defaultFormState);
    onSubmit(resetFormState); //clean the plot
  }

  function handleSelectChange(name, selection = []) {
    console.log(name, selection);
    if (name === "chromosome" && selection.find((option) => option.value === "all")) {
      selection = chromosomes.slice(1);
    }

    if (name === "types" && selection.find((option) => option.value === "all")) {
      selection = [
        { value: "loh", label: "CN-LOH" },
        { value: "loss", label: "Loss" },
        { value: "gain", label: "Gain" },
        { value: "undetermined", label: "Undetermined" },
      ];
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
    setCompare(true);
    //mergeForm({ compare: true });
    //onCompare({ compare: true });
    //update the compare variable and run the filter function to do compare
    setForm({ ...form, compare: true });
    // onFilter({ ...form, compare: true });

    console.log(compare, " comparing....", form);
    // onSubmit(form)
  }

  const handlegroupChange = (value, gname) => {
    //console.log(value, gname);
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
  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
      <Form.Group className="mb-3" controlId="study">
        <Form.Label className="required">Study</Form.Label>
        <Select
          placeholder="No study selected"
          name="study"
          isMulti={true}
          value={form.study}
          onChange={(ev) => handleSelectChange("study", ev)}
          options={[
            { value: "all", label: "All Studies" },
            { value: "plco", label: "PLCO" },
            { value: "ukbb", label: "UK BioBank" },
          ]}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="plotType">
        <Form.Label className="required">Plot Type</Form.Label>
        <OverlayTrigger
          overlay={
            <Tooltip id="plotType_tooltip">
              Circos plot displays all chromosomes, select Static plot to visualize a subset of chromosomes
            </Tooltip>
          }>
          <Select
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
        <Form.Group className="mb-3" controlId="chromosome">
          <Form.Label className="required">Chromosome</Form.Label>
          <Select
            placeholder="No chromosome selected"
            name="chromosome"
            isMulti={true}
            value={form.chromosome}
            onChange={(ev) => handleSelectChange("chromosome", ev)}
            options={chromosomes}
          />
        </Form.Group>
      ) : (
        <Form.Group className="mb-3" controlId="chromosome">
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
      <Form.Group className="mb-3" controlId="types">
        <Form.Label className="required">Copy Number State</Form.Label>
        <Select
          placeholder="No types selected"
          name="types"
          isMulti={true}
          value={form.types}
          onChange={(ev) => handleSelectChange("types", ev)}
          options={[
            { value: "all", label: "All Types" },
            { value: "loh", label: "CN-LOH" },
            { value: "loss", label: "Loss" },
            { value: "gain", label: "Gain" },
            { value: "undetermined", label: "Undetermined" },
          ]}
        />
      </Form.Group>

      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ backgroundColor: "#343a40" }}>Optional Fields</Accordion.Header>
          <Accordion.Body>
            {/* {form.chromosome.length >=0 ? <Form.Group className="mb-3" controlId="start">
                <Form.Label className="required">Event Start Position</Form.Label>
                <Form.Control
                name="start"
                type="number"
                value={form.start}
                onChange={handleChange}
                min="0"
              />
            </Form.Group> : <></>}
            {form.chromosome.length >=0 ? <Form.Group className="mb-3" controlId="end">
              <Form.Label className="required">Event End Position</Form.Label>
              <Form.Control
                name="end"
                type="number"
                value={form.end}
                onChange={handleChange}
                min="0"
              />
            </Form.Group> : <></>} */}
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
            <Form.Group className="mb-3" controlId="age">
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
                    <Form.Control placeholder="Min age" name="minAge" value={form.minAge} onChange={handleChange} />
                    {/* <InputGroup.Text></InputGroup.Text> */}
                  </InputGroup>
                </Col>
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control placeholder="Max age" name="maxAge" value={form.maxAge} onChange={handleChange} />
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
                options={[
                  { value: "mix_eur", label: "ADMIXED_EUR" },
                  { value: "AFR", label: "African" },
                  { value: "afr_eur", label: "AFR_EUR" },
                  { value: "ASN", label: "Asian" },
                  { value: "asn_eur", label: "ASN_EUR" },
                  { value: "EUR", label: "European" },
                ]}
              />
            </Form.Group>

            <Form.Group controlId="fraction">
              <Form.Label>Cellular Fraction</Form.Label>
              <Row>
                <Col xl={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min percentage"
                      name="minFraction"
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
                      value={form.maxFraction}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
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
          <Button variant="primary" type="submit" disabled={!isValid()}>
            Submit
          </Button>
        </OverlayTrigger>
      </div>
      <hr></hr>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ backgroundColor: "#343a40" }}>Compare Group</Accordion.Header>
          <Accordion.Body>
            <Card.Body>
              {compareChecks.map((ck) => (
                <div key={ck.id}>
                  <label>
                    <input type="checkbox" checked={ck.isChecked} onChange={() => handleCompareCheckboxChange(ck.id)} />
                    {ck.label}
                  </label>
                </div>
              ))}
            </Card.Body>
            <Card.Body>
              <p>Group A</p>
              <ComparePanel compareItem={compareChecks} name="A" onCompareChange={handlegroupChange}></ComparePanel>
            </Card.Body>
            <Card.Body>
              <p>Group B</p>
              <ComparePanel compareItem={compareChecks} name="B" onCompareChange={handlegroupChange}></ComparePanel>
              <br></br>
            </Card.Body>
            <Card.Body>
              <Row>
                <Col>
                  <Button variant="outline-secondary" className="me-1" type="button" onClick={handleFilter}>
                    Compare
                  </Button>
                  <Button variant="outline-secondary" className="me-1" type="button">
                    Clear
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Form>
  );
}
