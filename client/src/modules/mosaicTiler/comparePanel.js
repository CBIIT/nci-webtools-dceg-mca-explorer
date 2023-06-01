import { Form, Button, Accordion, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";

export default function ComparePanel(props) {
  const [form, setForm] = useRecoilState(formState);
  const [compareform, setCompareForm] = useState();
  const [study, setStudy] = useState([]);
  const [array, setArray] = useState([]);
  const [sex, setSex] = useState([]);
  const [ancestry, setAncestry] = useState([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  //console.log(props.compareItem[0]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "minAge") {
      setMinAge(value);
    }
    if (name === "maxAge") {
      setMaxAge(value);
    }
    setCompareForm({ ...compareform, [name]: value });
  }

  function handleSelectChange(name, selection = []) {
    if (props.compareItem[4].isChecked && name === "study") {
      setStudy(selection);
    }
    //mergeForm({ [name]: selection });

    if (props.compareItem[0].isChecked && name === "array") {
      setArray(selection);
    }
    if (props.compareItem[1].isChecked && name === "sex") {
      setSex(selection);
    }
    if (props.compareItem[3].isChecked && name === "ancestry") {
      setAncestry(selection);
    }
    setCompareForm({ ...compareform, [name]: selection });

    //console.log(compareform);
  }

  const updateForm = () => {
    if (props.name === "A") {
      setForm({ ...form, groupA: { ...compareform } });
    } else if (props.name === "B") {
      setForm({ ...form, groupB: { ...compareform } });
    }
    props.onCompareChange(compareform, props.name);
  };

  useEffect(() => {
    updateForm();
    // console.log(compareform);
    props.compareItem.forEach((element) => {
      if (!element.isChecked && compareform) {
        if (element.label === " Study") {
          setStudy([]);
          if (compareform.hasOwnProperty("study")) delete compareform.study;
        } else if (element.label === " Genotype Array") {
          setArray([]);
          if (compareform.hasOwnProperty("array")) delete compareform.array;
        } else if (element.label === " Genotype Sex") {
          setSex([]);
          if (compareform.hasOwnProperty("sex")) delete compareform.sex;
        } else if (element.label === " Age") {
          setMinAge(0);
          setMaxAge(0);
          if (compareform.hasOwnProperty("minAge")) delete compareform.minAge;
          if (compareform.hasOwnProperty("maxAge")) delete compareform.maxAge;
        } else if (element.label === " Ancestry") {
          setAncestry([]);
          if (compareform.hasOwnProperty("ancestry")) delete compareform.ancestry;
        }
      }
    });
  }, [compareform, props.compareItem]);

  return (
    <div>
      {props.compareItem[0].isChecked ? (
        <Form.Group className="mb-3" controlId="array">
          <Form.Label>Genotyping Array</Form.Label>
          <Select
            placeholder="No array selected"
            name="array"
            isMulti={true}
            value={array}
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
      {props.compareItem[1].isChecked ? (
        <Form.Group className="mb-3" controlId="sex">
          <Form.Label>Genotype Sex</Form.Label>
          <Select
            placeholder="No sex selected"
            name="sex"
            isMulti={true}
            value={sex}
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
      {props.compareItem[2].isChecked ? (
        <Form.Group className="mb-3" controlId="age">
          <Form.Label>Age</Form.Label>
          <Row>
            <Col xl={6}>
              <InputGroup>
                <Form.Control placeholder="Min age" name="minAge" value={minAge} onChange={handleChange} />
                {/* <InputGroup.Text></InputGroup.Text> */}
              </InputGroup>
            </Col>
            <Col xl={6}>
              <InputGroup>
                <Form.Control placeholder="Max age" name="maxAge" value={maxAge} onChange={handleChange} />
                {/* <InputGroup.Text></InputGroup.Text> */}
              </InputGroup>
            </Col>
          </Row>
        </Form.Group>
      ) : (
        ""
      )}
      {props.compareItem[3].isChecked ? (
        <Form.Group className="mb-3" controlId="ancestry">
          <Form.Label>Ancestry</Form.Label>
          <Select
            placeholder="No ancestry selected"
            name="ancestry"
            isMulti={true}
            value={ancestry}
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
      {props.compareItem[4].isChecked ? (
        <Form.Group className="mb-3" controlId="array">
          <Form.Label>Study</Form.Label>
          <Select
            placeholder="No study selected"
            name="study"
            isMulti={true}
            value={study}
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
