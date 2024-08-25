import React from "react";
import * as styles from "../../Style/MeshGradient.module.css";

const MeshGradient = ({ children }) => {
  return (
    <div className={styles.gradientWrap}>
      <div className={styles.meshgradient}>
        <div className={`${styles.color} ${styles.c1}`}></div>
        <div className={`${styles.color} ${styles.c2}`}></div>
        <div className={`${styles.color} ${styles.c3}`}></div>
        <div className={`${styles.color} ${styles.c4}`}></div>
      </div>
      {children}
    </div>
  );
};

export default MeshGradient;
