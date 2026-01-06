import React, { useState } from "react";
import ARoutes from "./Routes/ARoutes";
import LoadingContext from "./Utils/LoadingContext";

const isProduction = process.env.NODE_ENV === "production";

const Tail = () => (
  <asggen
    className="hidden"
    dangerouslySetInnerHTML={{
      __html: `Rendering Asggen DOM...</asggen></asggenapp></body></html>`,
    }}
  />
);

function App({ context }) {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <LoadingContext.Provider value={{ loading, setLoading }}>
        {loading && <LoadingIndicator />}
        <ARoutes context={context} />
        {isProduction ? <Tail /> : null}
      </LoadingContext.Provider>
    </>
  );
}

export default App;