import { Form, Button, Accordion, OverlayTrigger, Tooltip, InputGroup, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import { AncestryOptions, TypeStateOptions, StudyOptions, SexOptions, platformArray, smokeNFC,ifCancer } from "./constants";

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
  const [priorCancer, setPriorCancer] = useState("")
  const [hemaCancer, setHamaCancer] = useState("")
  const [lymCancer, setLymCancer] = useState("")
  const [myeCancer, setMyeCancer] = useState("")
  // console.log(study);
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
      if (value <= 150) setMinAge(Number(value));
      else setMinAge(0);
    }
    if (name === "maxAge") {
      if (value < 150) setMaxAge(Number(value));
      else setMaxAge(150);
    }
    //  setCompareForm({ ...compareform, [name]: value });
    if (name === "minFraction") {
      if (value <= 100) setMinFraction(value);
      else setMinFraction(0);
    }
    if (name === "maxFraction") {
      if (value <= 100) setMaxFraction(value);
      else setMaxFraction(100);
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
          } else if (element.label === " Array Platform") {
            setApproach([]);
          } else if (element.label === " Genotype Sex") {
            setSex([]);
          } else if (element.label === " Age") {
            setMinAge("0");
            setMaxAge("100");
          } else if (element.label === " Ancestry") {
            setAncestry([]);
          } else if (element.label === " Smoking Status") {
            setSmoking([]);
          } else if (element.label === " Copy Number State") {
            setTypes(null);
          } else if (element.label === " Cellular Fraction") {
            setMaxFraction("100");
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
              <Form.Label>Array Platform</Form.Label>
              <Select
                id={props.name + "approach"}
                aria-label={props.name + "approach"}
                placeholder="- Select -"
                name="approach"
                isMulti={true}
                value={approach}
                onChange={(ev) => handleSelectChange("approach", ev)}
                options={platformArray.filter((obj, index) =>
                  study.length < 2 && study.length > 0 ? (study[0].value === "plco" ? index < 2 : index >= 2) : true
                )}
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
                options={smokeNFC}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}

{props.compareItem[9].isChecked ? (
            <Form.Group className="mb-3" controlId="priorCancer">
              <Form.Label>Prior Cancer</Form.Label>
              <Select
                placeholder="- Select -"
                name="priorCancer"
                aria-label={props.name + "priorCancer"}
                id={props.name + "priorCancer"}
                isMulti={true}
                value={priorCancer}
                onChange={(ev) => handleSelectChange("priorCancer", ev)}
                options={ifCancer}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
           {props.compareItem[10].isChecked ? (
            <Form.Group className="mb-3" controlId="hemaCancer">
              <Form.Label>Incident Hematological Cancer</Form.Label>
              <Select
                placeholder="- Select -"
                name="hemaCancer"
                aria-label={props.name + "hemaCancer"}
                id={props.name + "hemaCancer"}
                isMulti={true}
                value={hemaCancer}
                onChange={(ev) => handleSelectChange("hemaCancer", ev)}
                options={ifCancer}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
           {props.compareItem[11].isChecked ? (
            <Form.Group className="mb-3" controlId="lymCancer">
              <Form.Label>Incident Lymphoid Cancer</Form.Label>
              <Select
                placeholder="- Select -"
                name="lymCancer"
                aria-label={props.name + "lymCancer"}
                id={props.name + "lymCancer"}
                isMulti={true}
                value={lymCancer}
                onChange={(ev) => handleSelectChange("lymCancer", ev)}
                options={ifCancer}
                classNamePrefix="select"
              />
            </Form.Group>
          ) : (
            ""
          )}
           {props.compareItem[12].isChecked ? (
            <Form.Group className="mb-3" controlId="myeCancer">
              <Form.Label>Incident Myeloid Cancer</Form.Label>
              <Select
                placeholder="- Select -"
                name="myeCancer"
                aria-label={props.name + "myeCancer"}
                id={props.name + "myeCancer"}
                isMulti={true}
                value={myeCancer}
                onChange={(ev) => handleSelectChange("myeCancer", ev)}
                options={ifCancer}
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
