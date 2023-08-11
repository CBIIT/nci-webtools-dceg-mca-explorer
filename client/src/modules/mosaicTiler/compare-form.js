import { Form, Button, Accordion, Card, OverlayTrigger, Tooltip, InputGroup, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { useRecoilState } from "recoil";
import { sampleState, formState, loadingState, defaultFormState, resetFormState } from "./explore.state";
import { useState, useRef, useEffect } from "react";
import ComparePanel from "./comparePanel";
import { AncestryOptions, CompareArray, TypeStateOptions } from "./constants";

const compareArray = CompareArray;
export default function CompareForm({ onSubmit, onReset, onClear, onFilter }) {
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
    //handleDisplayCompare();
  }

  function handleReset(event) {
    event.preventDefault();
    setForm(defaultFormState);
    setIsX(false);
    setIsY(false);
    //setCompare(false);
    if (onReset) onReset(defaultFormState);
    //onSubmit(resetFormState, "reset"); //clean the plot
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
    setForm({ ...form, compare: true, counterCompare: counter + 1 });
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
  useEffect(() => {
    //console.log("display compare", form);
  });
  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
      <Form.Group className="mb-3">
        <Form.Label>Please choose attributes to compare:</Form.Label>
        <Card style={{ backgroundColor: "#f8f8f8" }}>
          {compareChecks.map((ck) => (
            <div key={ck.id}>
              <label>
                <input type="checkbox" checked={ck.isChecked} onChange={() => handleCompareCheckboxChange(ck.id)} />
                {ck.label}
              </label>
            </div>
          ))}
        </Card>
        <br></br>

        <ComparePanel compareItem={compareChecks} name="A" onCompareChange={handlegroupChange}></ComparePanel>
        <br></br>
        <ComparePanel compareItem={compareChecks} name="B" onCompareChange={handlegroupChange}></ComparePanel>
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
