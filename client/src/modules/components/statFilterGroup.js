import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import React, { useState } from "react";


function StatFilterGroup() {
 const [selectedOption, setSelectedOption] = useState("none");
 function handleSelectChange(name, selection = []) {
   //console.log(name,selection);
   setSelectedOption(selection);
  }
  return (
   <Form >
    <Form.Group className="mb-3" controlId="fisher">
        {/* <Form.Label className="required">Test</Form.Label> */}
        <Select
          placeholder="No test selected"
          name="test"
          isMulti={true}
          value={selectedOption}
          onChange={(ev) => handleSelectChange("test", ev)}
          options={[
            { value: "Fisher", label: "Fisher Test" }
          ]}
        />
      </Form.Group>
   </Form>
  );
}

export default StatFilterGroup;