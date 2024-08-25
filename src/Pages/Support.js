import React from "react";
import HeadTags from "asggen-headtags";
import * as styles from "../Style/Support.module.css";
import MeshGradient from "../Components/Background/MeshGradient";

const Support = ({ context }) => {
  const title = "Support - AFront";
  const description =
    "Get support for AFront, a front-end JavaScript library for seamless server-side rendering.";
  const keywords = "support, AFront, server-side rendering, JavaScript";
  HeadTags({ title, description, keywords, context });

  return (
    <MeshGradient>
      <div className={styles.supportContainer}>
        <h1 className={styles.supportTitle}>Need Assistance?</h1>
        <p className={styles.supportDescription}>
          AFront is a cutting-edge front-end JavaScript library designed for
          seamless server-side rendering (SSR). We're committed to providing you
          with top-notch support to ensure your experience is smooth and
          productive.
        </p>
        <div className={styles.supportContent}>
          <div className={styles.supportCard}>
            <h2 className={styles.supportCardTitle}>Technical Assistance</h2>
            <p className={styles.supportCardContent}>
              Our dedicated technical support team is available around the clock
              to resolve any issues you may face with AFront. Connect with us
              through email or our support portal for prompt assistance.
            </p>
          </div>
          <div className={styles.supportCard}>
            <h2 className={styles.supportCardTitle}>Product Information</h2>
            <p className={styles.supportCardContent}>
              Curious about AFront’s capabilities? Reach out to our sales team
              for detailed insights on features, benefits, and how our library
              can enhance your web development projects.
            </p>
          </div>
          <div className={styles.supportCard}>
            <h2 className={styles.supportCardTitle}>Community and Forums</h2>
            <p className={styles.supportCardContent}>
              Join our vibrant community forums to discuss AFront with fellow
              developers, exchange tips, and troubleshoot common issues
              collaboratively.
            </p>
          </div>
        </div>
        <div className={styles.supportFAQ}>
          <h2 className={styles.supportCardTitle}>
            Frequently Asked Questions
          </h2>
          <ul className={styles.faqList}>
            <li>What is AFront and how does it work?</li>
            <li>How do I get started with AFront?</li>
            <li>Where can I find documentation and tutorials?</li>
            <li>How can I report a bug or request a feature?</li>
          </ul>
        </div>
        <a href="/" className={styles.footerLink}>
          Back to Homepage
        </a>
      </div>
    </MeshGradient>
  );
};

export default Support;
