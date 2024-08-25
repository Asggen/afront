import React from "react";
import * as styles from "../../Style/Style.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <a href="/" className={styles.footerLogo}>
            AFront
          </a>
          <p className={styles.footerDescription}>
            Empowering front-end development with cutting-edge tools and
            services.
          </p>
        </div>

        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4 className={styles.footerTitle}>Company</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="/about" className={styles.link}>
                  About Us
                </a>
              </li>
              <li>
                <a href="/careers" className={styles.link}>
                  Careers
                </a>
              </li>
              <li>
                <a href="/contact" className={styles.link}>
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h4 className={styles.footerTitle}>Resources</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="/blog" className={styles.link}>
                  Blog
                </a>
              </li>
              <li>
                <a href="/docs" className={styles.link}>
                  Documentation
                </a>
              </li>
              <li>
                <a href="/community" className={styles.link}>
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h4 className={styles.footerTitle}>Products</h4>
            <ul className={styles.linkList}>
              <li>
                <a href="/features" className={styles.link}>
                  Features
                </a>
              </li>
              <li>
                <a href="/pricing" className={styles.link}>
                  Pricing
                </a>
              </li>
              <li>
                <a href="/support" className={styles.link}>
                  Support
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <p className={styles.footerCopy}>
          © {new Date().getFullYear()} AFront by Asggen Inc. All rights
          reserved.
        </p>
        <div className={styles.socialLinks}>
          <a href="https://twitter.com" className={styles.socialLink}>
            Twitter
          </a>
          <a href="https://facebook.com" className={styles.socialLink}>
            Facebook
          </a>
          <a
            href="https://www.linkedin.com/showcase/asggenchat/"
            className={styles.socialLink}
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
