import React from "react";
import * as styles from "./Style/PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <div className={styles.pageNotFoundContainer}>
      <h2 className={styles.heading}>
        Oops! The page you're looking for doesn't exist.
      </h2>
      <p className={styles.subText}>
        It seems you’ve taken a wrong turn. Let’s get you back on track!
      </p>
      <a href="/" className={styles.homeLink}>
        Go to Homepage
      </a>
    </div>
  );
};

export default PageNotFound;