/*
 * File Name:  ARoutesStatic.js
 *
 * Description:  This file handles the logic for Handling Header and Footer to be visible or not for the every specific page for single page application (Static Page).
 *
 *
 * Author:  Mark Sea.
 *
 * Created:  14/Dec/2024
 *
 * Dependencies:  {react-router}
 *
 * Assumptions:  This file is used in appStatic.js
 */

import React, { Suspense, useContext } from "react";
import { Route, Routes } from "react-router";
import routes from "../ARoutes/AFRoutes.js";
import RequireAuth from "../Components/RequireAuth.js";
import LoadingIndicator from "../Components/Loading/LoadingIndicator.js";
import Header from "../Components/Header/Header.js";
import Footer from "../Components/Footer/Footer.js";
import LoadingContext from "../Utils/LoadingContext.js";

const Layout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

const ARoutesStatic = ({ context }) => {
  const { setLoading } = useContext(LoadingContext);
  return (
    <Routes>
      {routes.map(
        (
          { path, element: Element, withHeaderFooter, protected: isProtected },
          index
        ) => (
          <Route
            key={index}
            path={path}
            element={
              withHeaderFooter ? (
                <Layout>
                  <Suspense
                    fallback={<LoadingIndicator />}
                    onPromiseStart={() => setLoading(true)}
                    onPromiseEnd={() => setLoading(false)}>
                    {isProtected ? (
                      <RequireAuth>
                        <Element context={context} />
                      </RequireAuth>
                    ) : (
                      <Element context={context} />
                    )}
                  </Suspense>
                </Layout>
              ) : (
                <Suspense
                  fallback={<LoadingIndicator />}
                  onPromiseStart={() => setLoading(true)}
                  onPromiseEnd={() => setLoading(false)}>
                  {isProtected ? (
                    <RequireAuth>
                      <Element context={context} />
                    </RequireAuth>
                  ) : (
                    <Element context={context} />
                  )}
                </Suspense>
              )
            }
          />
        )
      )}
    </Routes>
  );
};

export default ARoutesStatic;
