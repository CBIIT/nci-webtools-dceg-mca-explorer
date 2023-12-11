import { Form, Button, Accordion, OverlayTrigger, Tooltip, InputGroup, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import { AncestryOptions, TypeStateOptions, StudyOptions, SexOptions } from "./constants";

export default function ComparePanel(props) {
  const [form, setForm] = useRecoilState(formState);
  const [study, setStudy] = useState([StudyOptions[0]]);
  const [approach, setApproach] = useState([]);
  const [sex, setSex] = useState([]);
  const [ancestry, setAncestry] = useState([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [smoking, setSmoking] = useState([]);
  const [types, setTypes] = useState([TypeStateOptions[0]]);
  const [minFraction, setMinFraction] = useState("");
  const [maxFraction, setMaxFraction] = useState("");
  const [compareform, setCompareForm] = useState({ study: study, types: types });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const compareRef = useRef(compareform);

  //reset
  useEffect(() => {
    handleSelectChange("study", [StudyOptions[0]]);
    handleSelectChange("types", [TypeStateOptions[0]]);
    // setCompareForm((prevForm) => ({ ...prevForm, study: [StudyOptions[0]] }));
    //console.log("&&&&", StudyOptions[0], compareform);
  }, [props.onReset]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "minAge") {
      setMinAge(value);
    }
    if (name === "maxAge") {
      if (value < 150) setMaxAge(value);
      else setMaxAge(150);
    }
    //  setCompareForm({ ...compareform, [name]: value });
    if (name === "minFraction") {
      setMinFraction(value);
    }
    if (name === "maxFraction") {
      setMaxFraction(value);
    }
    if (name === "start") {
      setStart(value);
    }
    if (name === "end") {
      setEnd(value);
    }
    setCompareForm({ ...compareform, [name]: value });
  }

  function handleSelectChange(name, selection = []) {
    console.log(name, selection);
    if (props.compareItem[4].isChecked && name === "study") {
      setStudy(selection);
    }
    //mergeForm({ [name]: selection });

    if (props.compareItem[0].isChecked && name === "approach") {
      setApproach(selection);
    }
    if (props.compareItem[1].isChecked && name === "sex") {
      const all = selection.find((option) => option.value === "all");
      const allindex = selection.indexOf(all);
      if (allindex == 0 && selection.length > 1) {
        selection.splice(allindex, 1);
      } else if (allindex > 0 && selection.length > 1) {
        selection = [all];
      }
      setSex(selection);
    }
    if (props.compareItem[3].isChecked && name === "ancestry") {
      const all = selection.find((option) => option.value === "all");
      const allindex = selection.indexOf(all);
      if (allindex == 0 && selection.length > 1) {
        selection.splice(allindex, 1);
      } else if (allindex > 0 && selection.length > 1) {
        selection = [all];
      }
      setAncestry(selection);
    }
    if (props.compareItem[6].isChecked && name === "smoking") {
      setSmoking(selection);
    }

    if (props.compareItem[7].isChecked && name === "types") {
      const all = selection.find((option) => option.value === "all");
      const allindex = selection.indexOf(all);
      //if all selected, then another option select, remove all
      //if other option selected, and select all again, then remove other, keep all
      if (allindex == 0 && selection.length > 1) {
        selection.splice(allindex, 1);
      } else if (allindex > 0 && selection.length > 1) {
        selection = [all];
      }
      setTypes(selection);
    }

    setCompareForm({ ...compareform, [name]: selection });
  }

  useEffect(() => {
    console.log("UpdateForm ", compareform);

    if (compareform !== undefined) {
      props.onCompareChange(compareform, props.name);
    }
  }, [compareform]);

  useEffect(() => {
    //updateForm();
    console.log("this is compare filter", compareform);
    const updatedcompareform = {};

    //props.compareItem.forEach((element) => {
    if (compareform !== undefined) {
      for (const element of props.compareItem) {
        if (element.isChecked) {
          if (element.value === "age") {
            updatedcompareform["minAge"] = compareform["minAge"];
            updatedcompareform["maxAge"] = compareform["maxAge"];
          } else if (element.value === "cf") {
            updatedcompareform["minFraction"] = compareform["minFraction"];
            updatedcompareform["maxFraction"] = compareform["maxFraction"];
          } else
            updatedcompareform[element.value] =
              compareform[element.value] === undefined ? [] : compareform[element.value];
        }
        if (!element.isChecked) {
          if (element.label === " Study") {
            setStudy([]);
          } else if (element.label === " Detection Approach") {
            setApproach([]);
          } else if (element.label === " Genotype Sex") {
            setSex([]);
          } else if (element.label === " Age") {
            setMinAge("0");
            setMaxAge("0");
          } else if (element.label === " Ancestry") {
            setAncestry([]);
          } else if (element.label === " Smoking Status") {
            setSmoking([]);
          } else if (element.label === " Copy Number State") {
            setTypes(null);
          } else if (element.label === " Cellular Fraction") {
            setMaxFraction("0");
            setMinFraction("0");
          }
        }
      }
    }
    setCompareForm(updatedcompareform);
    props.onCompareChange(updatedcompareform, props.name);
  }, [props.compareItem]);

  let showBorder = false;
  props.compareItem.forEach((e) => {
    if (e.isChecked) showBorder = true;
  });

  return (
    <>
      {props.compareItem.find((e) => {
        return e.isChecked;
      }) ? (
        <Form.Label>Group {props.name}</Form.Label>
      ) : (
        ""
      )}
      <div
        style={
          showBorder ? { border: "thin solid #dcdcdc", boxShadow: "0px 2px 4px rgba(0,0,0,0.2)", padding: "2px" } : {}
        }>
        <Container>
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
          {props.compareItem[4].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label className="required">Study</Form.Label>
              <Select
                placeholder="- Select -"
                name="study"
                aria-label={props.name + "study"}
                id={props.name + "study"}
                isMulti={true}
                value={study}
                onChange={(ev) => handleSelectChange("study", ev)}
                options={[
                  { value: "plco", label: "PLCO" },
                  { value: "ukbb", label: "UK Biobank" },
                ]}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[7].isChecked ? (
            <Form.Group className="mb-3" controlId="types">
              <Form.Label className="required">Copy Number State</Form.Label>
              <Select
                placeholder="- Select -"
                name="types"
                id={props.name + "types"}
                aria-label={props.name + "types"}
                isMulti={true}
                value={types}
                onChange={(ev) => handleSelectChange("types", ev)}
                options={TypeStateOptions}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[0].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Detection Approach</Form.Label>
              <Select
                id={props.name + "approach"}
                aria-label={props.name + "approach"}
                placeholder="- Select -"
                name="approach"
                isMulti={true}
                value={approach}
                onChange={(ev) => handleSelectChange("approach", ev)}
                options={[
                  { value: "gsa", label: "Illumina Global Screening Array" },
                  { value: "oncoArray", label: "Illumina OncoArray Array" },
                ]}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[1].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Genotype Sex</Form.Label>
              <Select
                id={props.name + "sex"}
                aria-label={props.name + "sex"}
                placeholder="- Select -"
                name="sex"
                isMulti={true}
                value={sex}
                onChange={(ev) => handleSelectChange("sex", ev)}
                options={SexOptions}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[2].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min"
                      name="minAge"
                      id={props.name + "minAgeCompare"}
                      value={minAge}
                      onChange={handleChange}
                      classNamePrefix="select"
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
                      id={props.name + "maxAgeCompare"}
                      value={maxAge}
                      onChange={handleChange}
                      classNamePrefix="select"
                    />
                    {/* <InputGroup.Text></InputGroup.Text> */}
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[3].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Ancestry</Form.Label>
              <Select
                placeholder="- Select -"
                name="ancestry"
                aria-label={props.name + "ancestry"}
                id={props.name + "ancestry"}
                isMulti={true}
                value={ancestry}
                onChange={(ev) => handleSelectChange("ancestry", ev)}
                options={AncestryOptions}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}

          {props.compareItem[5].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Cellular Fraction</Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Min"
                      name="minFraction"
                      id={props.name + "minFractionCompare"}
                      value={minFraction}
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
                      id={props.name + "maxFractionCompare"}
                      value={maxFraction}
                      onChange={handleChange}
                    />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          ) : (
            ""
          )}
          {props.compareItem[6].isChecked ? (
            <Form.Group className="mb-3" controlId="smoking">
              <Form.Label>Smoking Status</Form.Label>
              <Select
                placeholder="- Select -"
                name="smoking"
                aria-label={props.name + "smoking"}
                id={props.name + "smoking"}
                isMulti={true}
                value={smoking}
                onChange={(ev) => handleSelectChange("smoking", ev)}
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}

          {/* {props.compareItem[8].isChecked ? (
            <Form.Group className="mb-3">
              <Form.Label>Range</Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Start"
                      name="start"
                      id={props.name + "Start"}
                      value={start}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </Col>
                __
                <Col xl={5}>
                  <InputGroup>
                    <Form.Control
                      placeholder="End"
                      name="end"
                      id={props.name + "end"}
                      value={end}
                      onChange={handleChange}
                    />
                  
                  </InputGroup>
                </Col>
              </Row>
            </Form.Group>
          ) : (
            ""
          )
          } */}
        </Container>
      </div>
    </>
  );
}
