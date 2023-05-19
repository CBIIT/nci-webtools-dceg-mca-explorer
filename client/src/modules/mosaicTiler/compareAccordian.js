import React, { createContext, useState } from "react";

export const AccordionContext = createContext();

export default function AccordionProvider(props) {
  const [isCollapsed, setIsCollapse] = useState(true);

  const toggleCollapse = () => {
    setIsCollapse(!isCollapsed);
  };

  const value = { isCollapsed, toggleCollapse };

  return <AccordionContext.Provider value={value}>{props.children}</AccordionContext.Provider>;
}
