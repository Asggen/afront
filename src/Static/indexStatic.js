import React from "react";
import ReactDOM from "react-dom/client";
import App from "./appStatic";

const asggen = ReactDOM.createRoot(document.getElementById("asggen"));
asggen.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
