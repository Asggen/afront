import React from "react";
import * as appStyles from "./Style/App.module.css";
import logo from "../dev/logo512.png";

const LoadingFallback = () => {
  return (
    <div className={appStyles.loadingContainer}>
      <img src={logo} alt="Loading..." className={appStyles.loadingLogo} />
    </div>
  );
};

export default LoadingFallback;
