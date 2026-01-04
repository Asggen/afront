import React from "react";
import * as styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({ size }) => {
  const scaleFactor = size / 80;
  return (
      <div
        style={{ transform: `scale(${scaleFactor})` }}
        className={styles.ldsSpinner}
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
  );
};

export default LoadingSpinner;
