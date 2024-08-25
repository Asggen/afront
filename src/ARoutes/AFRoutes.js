import { lazy } from "react";


const routes = [
  { path: "/", element: lazy(() => import("../Pages/Home.js")) },
  { path: "/support", element: lazy(() => import("../Pages/Support.js")) },
  { path: "/*", element: lazy(() => import("../PageNotFound.js")) }, // Page Not Found route
  // Add More Pages
];

export default routes;