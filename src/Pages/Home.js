import React from "react";
import MeshGradient from "../Components/Background/MeshGradient";
import tensorlabLogo from "../Assets/images/afront.png";
import arrowright from "../Assets/images/arrow-right.svg";
import HeadTags from "asggen-headtags";
import * as styles from "../Style/Style.module.css";

const Home = ({ context }) => {
  const title = "AFront by Asggen Inc.";
  const description = "Home for all AFront products and services.";
  const keywords = "Home, Afront, help";
  HeadTags({ title, description, keywords, context });

  return (
    <MeshGradient>
      <main>
        <section className={styles.section}>
          <div className={`${styles.container} ${styles.bannerColumn}`}>
            <img
              className={styles.bannerImage}
              src={tensorlabLogo}
              alt="banner"
            />
            <div className={styles.bannerInner}>
              <h1 className={styles.headingXl}>
                Empower Your Front-End with AFront
              </h1>
              <p className={styles.paragraph}>
                AFront streamlines front-end development with robust tools and
                <b> seamless server-side rendering (SSSR)</b>. Build dynamic,
                high-performance web experiences effortlessly.
              </p>
              <div>
                <a
                  href="/"
                  className={`${styles.btnDarken} ${styles.menuBlock}`}
                >
                  Get Started{" "}
                  <img className={styles.btnDarkenArrow} src={arrowright} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MeshGradient>
  );
};

export default Home;
