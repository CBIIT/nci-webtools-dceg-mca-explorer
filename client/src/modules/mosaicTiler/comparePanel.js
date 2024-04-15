import { Form, Button, Accordion, OverlayTrigger, Tooltip, InputGroup, Row, Col, Container } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import {
  AncestryOptions,
  TypeStateOptions,
  StudyOptions,
  SexOptions,
  platformArray,
  smokeNFC,
  ifCancer,
} from "./constants";

export default function ComparePanel(props) {
  const [form, setForm] = useRecoilState(formState);
  const [study, setStudy] = useState([StudyOptions[0]]);
  const [approach, setApproach] = useState([]);
  const [sex, setSex] = useState([]);
  const [ancestry, setAncestry] = useState([]);
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [smoking, setSmoking] = useState([]);
  const [types, setTypes] = useState([]);
  const [minFraction, setMinFraction] = useState("");
  const [maxFraction, setMaxFraction] = useState("");
  const [compareform, setCompareForm] = useState({ study: study, types: types });
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const compareRef = useRef(compareform);
  const [priorCancer, setPriorCancer] = useState("");
  const [hemaCancer, setHemaCancer] = useState("");
  const [lymCancer, setLymCancer] = useState("");
  const [myeCancer, setMyeCancer] = useState("");
  const [disabledType, setDisabledType] = useState([]);
  const [resetpanel, setResetpanel] = useState(false);
  // console.log(study);
  //reset
  useEffect(() => {
    handleSelectChange("study", [StudyOptions[0]]);
    handleSelectChange("types", [TypeStateOptions[props.isX || props.isY ? 2 : 0]]);
    // setCompareForm((prevForm) => ({ ...prevForm, study: [StudyOptions[0]] }));
    //console.log("&&&&", StudyOptions[0], compareform);
    if (props.isY || props.isX) setDisabledType(["all", "loh", "gain", "undetermined"]);
    else setDisabledType([]);
    if (form.plotType.value === "static") setDisabledType([]);
  }, [props.onReset, props.isX, props.isY]);

  useEffect(() => {
    console.log(compareform);
    setCompareForm({ study: [StudyOptions[0]], types: [TypeStateOptions[0]] });
    setResetpanel(true);
  }, [props.onReset]);

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === "minAge") {
      if (value <= 100) setMinAge(Number(value));
      else setMinAge(0);
    }
    if (name === "maxAge") {
      if (value < 100) setMaxAge(Number(value));
      else setMaxAge(100);
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
    // console.log(name, selection);
    if (props.compareItem[4].isChecked && name === "study") {
      setStudy(selection);
    }
    //mergeForm({ [name]: selection });

    if (props.compareItem[0].isChecked && name === "approach") {
      setApproach(selection);
    }
    if (props.compareItem[1].isChecked && name === "sex") {
      // const all = selection.find((option) => option.value === "all");
      // const allindex = selection.indexOf(all);
      // if (allindex == 0 && selection.length > 1) {
      //   selection.splice(allindex, 1);
      // } else if (allindex > 0 && selection.length > 1) {
      //   selection = [all];
      // }
      setSex(setAllOption(selection));
    }
    if (props.compareItem[3].isChecked && name === "ancestry") {
      // const all = selection.find((option) => option.value === "all");
      // const allindex = selection.indexOf(all);
      // if (allindex == 0 && selection.length > 1) {
      //   selection.splice(allindex, 1);
      // } else if (allindex > 0 && selection.length > 1) {
      //   selection = [all];
      // }
      setAncestry(setAllOption(selection));
    }
    if (props.compareItem[6].isChecked && name === "smoking") {
      setSmoking(selection);
    }

    if (props.compareItem[7].isChecked && name === "types") {
      // const all = selection.find((option) => option.value === "all");
      // const allindex = selection.indexOf(all);
      // //if all selected, then another option select, remove all
      // //if other option selected, and select all again, then remove other, keep all
      // if (allindex == 0 && selection.length > 1) {
      //   selection.splice(allindex, 1);
      // } else if (allindex > 0 && selection.length > 1) {
      //   selection = [all];
      // }
      setTypes(setAllOption(selection));
      const notForXY = selection.find((option) => option.value === "loss" || option.value === "all");
      props.setShowXY(notForXY !== undefined && selection.length);
      console.log(selection);
    }

    if (props.compareItem[9].isChecked && name === "priorCancer") {
      setPriorCancer(setAllOption(selection));
    }
    if (props.compareItem[10].isChecked && name === "hemaCancer") {
      setHemaCancer(setAllOption(selection));
    }
    if (props.compareItem[11].isChecked && name === "lymCancer") {
      setLymCancer(setAllOption(selection));
    }
    if (props.compareItem[12].isChecked && name === "myeCancer") {
      setMyeCancer(setAllOption(selection));
    }

    setCompareForm({ ...compareform, [name]: selection });
  }

  function setAllOption(selection) {
    const all = selection.find((option) => option.value === "all");
    const allindex = selection.indexOf(all);
    if (allindex == 0 && selection.length > 1) {
      selection.splice(allindex, 1);
    } else if (allindex > 0 && selection.length > 1) {
      selection = [all];
    }
    return selection;
  }
  //any click on form's group attributes values, pass groups filter values to compareform
  useEffect(() => {
    console.log("UpdateForm ", compareform);

    if (compareform !== undefined) {
      props.onCompareChange(compareform, props.name);
    }
  }, [compareform]);

  //any click on attributes select checkbox, update the updatedcompareform which keep updated filters
  //based on if attributes checkbox, clean the selection
  useEffect(() => {
    //updateForm();
    console.log("this is compare filter", compareform, resetpanel);
    const updatedcompareform = resetpanel
      ? {
          study: [StudyOptions[0]],
          types: [TypeStateOptions[0]],
          // minAge: 0,
          // maxAge: 100,
          // minFraction: 0,
          // maxFraction: 100,
        }
      : {};

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
          } else if (element.label === " Prior Cancer") {
            setPriorCancer("");
          } else if (element.label === " Incident Hematological Cancer") {
            setHemaCancer("");
          } else if (element.label === " Incident Lymphoid Cancer") {
            setLymCancer("");
          } else if (element.label === " Incident Myeloid Cancer") {
            setMyeCancer("");
          }
        }
      }
    }
    setCompareForm(updatedcompareform);
    props.onCompareChange(updatedcompareform, props.name);
    setResetpanel(false);
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
              <Form.Label style={{ color: "red" }}>{study.length === 0 ? "Study field is required" : ""}</Form.Label>
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
              <Form.Label style={{ color: "red" }}>{types.length === 0 ? "Study field is required!" : ""}</Form.Label>
              <Select
                placeholder="- Select -"
                name="types"
                id={props.name + "types"}
                aria-label={props.name + "types"}
                isMulti={true}
                value={types}
                onChange={(ev) => handleSelectChange("types", ev)}
                options={TypeStateOptions}
                isOptionDisabled={(option) => disabledType.includes(option.value)}
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
              <Form.Label style={{ color: "red" }}>
                {maxAge && minAge && parseInt(maxAge) <= parseInt(minAge)
                  ? "Upper age limit must be greater than lower age limit"
                  : ""}
              </Form.Label>
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
              <Form.Label style={{ color: "red" }}>
                {maxFraction && minFraction && parseFloat(maxFraction) <= parseFloat(minFraction)
                  ? "Maximum cellular fraction must be greater than minimum cellular fraction"
                  : ""}
              </Form.Label>
              <Row>
                <Col xl={5}>
                  <InputGroup size="sm">
                    <Form.Control
                      style={{ width: "auto", flex: 1 }}
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
                  <InputGroup size="sm">
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
