import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("../Pages/Home.js")),
    withHeaderFooter: true,
  },
  {
    path: "/signup",
    element: lazy(() => import("../Pages/Signup.js")),
    withHeaderFooter: false,
  },
  {
    path: "/support/s",
    element: lazy(() => import("../Pages/Support.js")),
    protected: true,
    withHeaderFooter: true,
  },
  {
    path: "/*",
    element: lazy(() => import("../PageNotFound.js")),
    withHeaderFooter: true,
  }, // Page Not Found route
  // Add More Pages
];

export default routes;
