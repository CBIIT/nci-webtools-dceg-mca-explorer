import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import React, { useState } from "react";

const formState = {
  study: [{ value: 'plco', label: "PLCO" }],
  array: '',
  sex:'',
  age:'',
  ancestry:'',
  submitted: false,
};

function FilterGroup() {
 const [selectedOption, setSelectedOption] = useState("none");
 const [form, setForm] = useState(formState);
 const mergeForm = (obj) => setForm({ ...form, ...obj });

 function handleSelectChange(name, selection = []) {
   //console.log(name,selection);
   mergeForm({[name]:selection})
   setSelectedOption(selection);
  }
  return (
   <Form >
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
     <Form.Group className="mb-3" controlId="array">
        <Form.Label className="required">Array</Form.Label>
        <Select
          placeholder="No Array selected"
          name='array'
          isMulti={true}
          value={form.array}
          onChange={(ev) => handleSelectChange("array", ev)}
          options=''
        />
      </Form.Group>
       <Form.Group className="mb-3" controlId="sex">
        <Form.Label className="required">Sex</Form.Label>
        <Select
          placeholder="No sex selected"
          name="sex"
          isMulti={true}
          value={form.sex}
          onChange={(ev) => handleSelectChange("sex", ev)}
          options={[
            { value: "Male", label: "male" },
            { value: "Female", label: "female"}
          ]}
        />
      </Form.Group>
       <Form.Group className="mb-3" controlId="age">
        <Form.Label className="required">Age</Form.Label>
        <Select
          placeholder="No age selected"
          name="age"
          isMulti={true}
          value={form.age}
          onChange={(ev) => handleSelectChange("age", ev)}
          options=''
        />
      </Form.Group>
       <Form.Group className="mb-3" controlId="ancestry">
        <Form.Label className="required">Ancestry</Form.Label>
        <Select
          placeholder="No ancestry selected"
          name="ancestry"
          isMulti={true}
          value={form.ancestry}
          onChange={(ev) => handleSelectChange("ancestry", ev)}
          options={[
            { value: "mix_eur", label: "ADMIXED_EUR" },
            { value: "afr", label: "AFR"},
             { value: "afr_eur", label: "AFR_EUR" },
            { value: "asn", label: "ASN"},
             { value: "asn_eur", label: "ASN_EUR" },
            { value: "eur", label: "EUR"}
          ]}
        />
      </Form.Group>
   </Form>
  );
}

export default FilterGroup;