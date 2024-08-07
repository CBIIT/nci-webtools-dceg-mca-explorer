import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import React, { useState } from "react";

const formState = {
  study: [{ value: "plco", label: "PLCO" }],
  approach: "",
  sex: "",
  age: "",
  ancestry: "",
  submitted: false,
};

function FilterGroup() {
  const [selectedOption, setSelectedOption] = useState("none");
  const [form, setForm] = useState(formState);
  const mergeForm = (obj) => setForm({ ...form, ...obj });

  function handleSelectChange(name, selection = []) {
    //console.log(name,selection);
    mergeForm({ [name]: selection });
    setSelectedOption(selection);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    mergeForm({ [name]: value });
  }

  return (
    <Form>
      <Form.Group className="mb-3" controlId="study">
        <Form.Label className="required">Study</Form.Label>
        <Select
          placeholder="- Select -"
          name="study"
          isMulti={true}
          value={form.study}
          onChange={(ev) => handleSelectChange("study", ev)}
          options={[{ value: "plco", label: "PLCO" }]}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="approach">
        <Form.Label className="required">Array</Form.Label>
        <Select
          placeholder="No approach selected"
          name="approach"
          isMulti={true}
          value={form.approach}
          onChange={(ev) => handleSelectChange("approach", ev)}
          options=""
        />
      </Form.Group>
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
            { value: "female", label: "Female" },
          ]}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="age">
        <Form.Label>Age</Form.Label>
        <Form.Control placeholder="No age selected" name="age" type="number" value={form.age} onChange={handleChange} />
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
            { value: "afr", label: "AFR" },
            { value: "afr_eur", label: "AFR_EUR" },
            { value: "asn", label: "ASN" },
            { value: "asn_eur", label: "ASN_EUR" },
            { value: "eur", label: "EUR" },
          ]}
        />
      </Form.Group>
    </Form>
  );
}

export default FilterGroup;
