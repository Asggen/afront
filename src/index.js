import React from "react";
import ReactDOM, { hydrateRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router";

const container = document.getElementById("asggen");

// Create a root for React
const root = ReactDOM.createRoot(container);

if (process.env.NODE_ENV === "production") {
  // Use `hydrateRoot` for production
  hydrateRoot(
    container,
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
} else {
  root.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
  );
}
