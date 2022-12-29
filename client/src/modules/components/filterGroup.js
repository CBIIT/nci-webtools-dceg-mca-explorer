import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import React, { useState } from "react";

function FilterGroup() {
 const [selectedOption, setSelectedOption] = useState("none");
 function handleSelectChange(name, selection = []) {
   //console.log(name,selection);
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
          value=''
          onChange={(ev) => handleSelectChange("study", ev)}
          options=''
        />
      </Form.Group>
     <Form.Group className="mb-3" controlId="array">
        <Form.Label className="required">Array</Form.Label>
        <Select
          placeholder="No Array selected"
          name="array"
          isMulti={true}
          value=''
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
          value={selectedOption}
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
          value=''
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
          value=''
          onChange={(ev) => handleSelectChange("ancestry", ev)}
          options=''
        />
      </Form.Group>
   </Form>
  );
}

export default FilterGroup;