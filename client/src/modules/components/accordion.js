import Accordion from 'react-bootstrap/Accordion';
import FilterGroup from './filterGroup';
import StatFilterGroup from './statFilterGroup';
import "../../App.css";

function SelectionPane() {
  return (
    <Accordion defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header  style={{ backgroundColor: '#343a40' }}>Selection/Filtering Pane</Accordion.Header>
        <Accordion.Body>
         <FilterGroup></FilterGroup>
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Compare Groups</Accordion.Header>
        <Accordion.Body>
          <FilterGroup></FilterGroup>
        </Accordion.Body>
      </Accordion.Item>
       <Accordion.Item eventKey="2">
        <Accordion.Header>Statistical Tools</Accordion.Header>
        <Accordion.Body>
        <StatFilterGroup></StatFilterGroup>
        </Accordion.Body>
      </Accordion.Item>
       <Accordion.Item eventKey="3">
        <Accordion.Header>Upload mCA Data</Accordion.Header>
        <Accordion.Body>
        
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default SelectionPane;