import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import classNames from "classnames";
import { useRecoilState, useRecoilValue } from "recoil";
import { sampleState, formState, defaultFormState, geneState } from "./explore.state";
import { useState } from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function ExploreForm({ onSubmit, onReset }) {
  const sample = useRecoilValue(sampleState);
  const [form, setForm] = useState(defaultFormState);

  const genes = useRecoilValue(geneState).records.map((e) => {
    return { value: e.id, label: e.name };
  });


  function handleChange(event) {
    const { name, value } = event.target;
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
   
  }

  // avoid loading all samples as Select options
  function filterSamples(value, limit = 100) {

  }

  function isValid() {
   
  }

  return (
    <Form onSubmit={handleSubmit} onReset={handleReset}>
    
      <div className="text-end">
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
