import React from "react";
import * as styles from "./LoadingIndicator.module.css"; 

const LoadingIndicator = () => {
  return (
    <div className={styles.loadingIndicator}>
      <div className={styles.loadingLine}></div>
    </div>
  );
};

export default LoadingIndicator;
