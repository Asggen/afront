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
        <main className="main">
          <section className="section banner banner-section">
            <div className="container banner-column">
              <img className="banner-image" src={tensorlabLogo} alt="banner" />
              <div className="banner-inner">
                <h1 className="heading-xl">
                  Empower Your Front-End with AFront
                </h1>
                <p className="paragraph">
                  AFront streamlines front-end development with robust tools and
                  <b> seamless server-side rendering (SSSR)</b>. Build dynamic,
                  high-performance web experiences effortlessly.
                </p>
                <div className="btn-darken-block">
                  <a href="/" className="btn-darken menu-block">
                    Get Started{" "}
                    <img className="btn-darken-arrow" src={arrowright} />
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
