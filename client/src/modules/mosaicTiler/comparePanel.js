import { Form, Button, Accordion, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";

export default function ComparePanel(props) {
  const [form, setForm] = useState(defaultFormState);
  //console.log(props.compareItem[0]);

  function handleChange(event) {
    const { name, value } = event.target;
  }

  function handleSelectChange(name, selection = []) {}

  return (
    <div>
      {props.compareItem[0].isChecked ? (
        <Form.Group className="mb-3" controlId="array">
          <Form.Label>Study</Form.Label>
          <Select
            placeholder="No study selected"
            name="study"
            isMulti={true}
            value={form.study}
            onChange={(ev) => handleSelectChange("study", ev)}
            options={[
              { value: "plco", label: "PLCO" },
              { value: "ukbb", label: "UK BioBank" },
            ]}
          />
        </Form.Group>
      ) : (
        ""
      )}
      {props.compareItem[1].isChecked ? (
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
      ) : (
        ""
      )}

      {/* <Form.Group className="mb-3" controlId="algorithm">
        <Form.Label>Detection Algorithm</Form.Label>
        <Select
          placeholder="No algorithm selected"
          name="algorithm"
          isMulti={true}
          value={form.algorithm}
          onChange={(ev) => handleSelectChange("algorithm", ev)}
          options={[{ value: "test", label: "Placeholder" }]}
        />
      </Form.Group> */}
      {props.compareItem[2].isChecked ? (
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
      ) : (
        ""
      )}
      {props.compareItem[3].isChecked ? (
        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Age</Form.Label>
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
      ) : (
        ""
      )}
      {props.compareItem[4].isChecked ? (
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
      ) : (
        ""
      )}

      {/* <Form.Group controlId="fraction">
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
      </Form.Group> */}
    </div>
  );
}
