import { Form, Button, Accordion, OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState, useRecoilValue } from "recoil";
import { sampleState, formState, defaultFormState } from "./explore.state";
import { useState } from "react";

export default function ExploreForm({ onSubmit, onReset }) {
  const [selectedOption, setSelectedOption] = useState("none");
  //const sample = useRecoilValue(sampleState);
  const [form, setForm] = useState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });
  const chromosomes = Array.from({ length: 23 }, (_, i) => i + 1).map((i) => { return ({ value: i, label: i }) })
  console.log(form)

  function handleChange(event) {
    const { name, value } = event.target;
    mergeForm({ [name]: value })
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (onSubmit) onSubmit(form);
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    if (onReset) onReset(defaultFormState);
  }

  function handleSelectChange(name, selection = []) {
    //console.log(name,selection);
    mergeForm({ [name]: selection })
    setSelectedOption(selection);
  }

  // avoid loading all samples as Select options
  function filterSamples(value, limit = 100) {

  }

  function isValid() {
    return form.study && form.chromosome && form.start && form.end && form.types && form.cpNum;
  }

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
            { value: "plco", label: "PLCO" }
          ]}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="chromosome">
        <Form.Label className="required">Chromosome</Form.Label>
        <Select
          placeholder="No chromosome selected"
          name='chromosome'
          value={form.chromosome}
          onChange={(ev) => handleSelectChange("chromosome", ev)}
          options={chromosomes}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="start">
        <Form.Label className="required">Event Start Position</Form.Label>
        <Form.Control
          name="start"
          type="number"
          value={form.start}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="end">
        <Form.Label className="required">Event End Position</Form.Label>
        <Form.Control
          name="end"
          type="number"
          value={form.end}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="types">
        <Form.Label className="required">mCA Types</Form.Label>
        <Select
          placeholder="No types selected"
          name="types"
          isMulti={true}
          value={form.types}
          onChange={(ev) => handleSelectChange("types", ev)}
          options={[
            { value: "CN-LOH", label: "CN-LOH" },
            { value: "mLOX", label: "Loss of X Chromosome" },
            { value: "mLOY", label: "Loss of Y Chromosome" },
            { value: "Gain", label: "Gain" },
            { value: "Loss", label: "Loss" },
            { value: "Undetermined", label: "Undetermined" },
          ]}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="cpNum">
        <Form.Label className="required">State Copy Number Event</Form.Label>
        <Form.Control
          name="cpNum"
          type="number"
          value={form.cpNum}
          onChange={handleChange}
        />
      </Form.Group>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ backgroundColor: '#343a40' }}>Optional Fields</Accordion.Header>
          <Accordion.Body>

            <Form.Group className="mb-3" controlId="sex">
              <Form.Label>Sex</Form.Label>
              <Select
                placeholder="No sex selected"
                name="sex"
                isMulti={true}
                value={form.sex}
                onChange={(ev) => handleSelectChange("sex", ev)}
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" }
                ]}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                placeholder="No age selected"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
              />
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
                  { value: "EUR", label: "European" }
                ]}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="array">
              <Form.Label>Genotyping Array</Form.Label>
              <Select
                placeholder="No array selected"
                name="array"
                isMulti={true}
                value={form.array}
                onChange={(ev) => handleSelectChange("array", ev)}
                options={[
                  { value: "test", label: "Pladeholder" },
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
                options={[
                  { value: "test", label: "Pladeholder" },
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
                options={[
                  { value: "test", label: "Pladeholder" },
                ]}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="smoking">
              <Form.Label>Smoking Status</Form.Label>
              <Select
                placeholder="No status selected"
                name="smoking"
                value={form.smoking}
                onChange={(ev) => handleSelectChange("smoking", ev)}
                options={[
                  { value: "smoker", label: "Smoker" },
                  { value: "nonSmoker", label: "Non Smoker" },
                  { value: "formerSmoker", label: "Former Smoker" },
                ]}
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="m-3 text-end">
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
    </Form>
  );
}
