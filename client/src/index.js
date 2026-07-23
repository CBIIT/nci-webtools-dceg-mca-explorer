import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/main.scss";
//import "./services/main.js"
import App from "./App";
import reportWebVitals from "./reportWebVitals";

createRoot(document.getElementById("root")).render(
  <App />
);

Array.from(document.querySelectorAll("[react-cloak]")).forEach((node) => node.removeAttribute("react-cloak"));

reportWebVitals();
