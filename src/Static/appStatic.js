import React, { useState } from "react";
import ARoutesStatic from "../Routes/ARoutesStatic.js";
import LoadingContext from "../Utils/LoadingContext.js";
import LoadingIndicator from "../Components/Loading/LoadingIndicator.js";


function appStatic({ context }) {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingIndicator />}
      <ARoutesStatic context={context} />
    </LoadingContext.Provider>
  );
}
export default appStatic;
