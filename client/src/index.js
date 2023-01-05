import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/main.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

Array.from(document.querySelectorAll("[react-cloak]")).forEach((node) =>
  node.removeAttribute("react-cloak"),
);

reportWebVitals(console.log);