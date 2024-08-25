import React from "react";
import ARoutes from "./Routes/ARoutes";
import Header from "./Components/Header/Header.js";
import Footer from "./Components/Footer/Footer.js";

const isProduction = process.env.NODE_ENV === "production";

const Tail = () => (
  <asggen
    style={{ display: "none" }}
    dangerouslySetInnerHTML={{
      __html: `Rendering Asggen DOM...</asggen></asggenapp></body></html>`,
    }}
  />
);

function App({ context }) {
  return (
    <>
      <Header />
      <ARoutes context={context} />
      <Footer />
      {isProduction ? <Tail /> : null}
    </>
  );
}

export default App;
