import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import routes from "../ARoutes/AFRoutes.js";
import LoadingFallback from "../LoadingFallback.js";

import Header from "../Components/Header/Header.js";
import Footer from "../Components/Footer/Footer.js";

function appStatic() {
  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Header />
        <Routes>
          {/* Pages Routes */}
          {routes.map(({ path, element: Element }, index) => (
            <Route key={index} path={path} element={<Element />} />
          ))}
          {/* Pages Routes */}
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  );
}
export default appStatic;
