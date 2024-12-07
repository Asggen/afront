import React, { Suspense } from "react";
import { Route, Routes } from "react-router";
import routes from "../ARoutes/AFRoutes.js";
import LoadingFallback from "../LoadingFallback.js";


const ARoutes = ({ context }) => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Pages Routes */}
        {routes.map(({ path, element: Element }, index) => (
          <Route
            key={index}
            path={path}
            element={<Element context={context} />}
          />
        ))}
        {/* Pages Routes */}
      </Routes>
    </Suspense>
  );
};

export default ARoutes;
