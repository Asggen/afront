import React, { useState } from "react";
import ARoutes from "./Routes/ARoutes";
import LoadingContext from "./Utils/LoadingContext";

const isProduction = process.env.NODE_ENV === "production";

const Tail = () => (
  <asggen
    style={{ display: "none" }}
    dangerouslySetInnerHTML={{
      __html: `Rendering Asggen DOM...</asggen></asggenapp><script>window.addEventListener('load', () => { const loadingElement = document.getElementById('loading'); if (loadingElement) { setTimeout(() => { loadingElement.style.display = 'none'; }, 00);}});</script><script>if ("serviceWorker" in navigator) { window.addEventListener("load", () => { navigator.serviceWorker .register("/service-worker.js") .then((registration) => { registration.scope }) .catch((error) => { console.error("Service Worker registration failed:", error); }); }); }</script></body></html>`,
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