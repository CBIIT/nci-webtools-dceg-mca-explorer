import React from "react";
import { Accordion, Card } from "react-bootstrap";

const CustomToggle = ({ children, eventKey }) => {
  return (
    <Card.Header>
      <Accordion.Toggle></Accordion.Toggle>
    </Card.Header>
  );
};

export const AccordionContext = createContext();

export default function AccordionProvider(props) {
  const [isCollapsed, setIsCollapse] = useState(true);

  const toggleCollapse = () => {
    setIsCollapse(!isCollapsed);
  };

  const value = { isCollapsed, toggleCollapse };

  return <AccordionContext.Provider value={value}>{props.children}</AccordionContext.Provider>;
}
