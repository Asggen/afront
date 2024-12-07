import React, { useState, useEffect } from "react";
import * as styles from "../../Style/Style.module.css";

const Header = () => {
  const [isBurgerActive, setBurgerActive] = useState(false);
  const [isScrolled, setScrolled] = useState(false);

  // Toggle burger and menu
  const toggleMenu = () => {
    setBurgerActive(!isBurgerActive);
  };

  // Handle click on menu links
  const closeMenu = () => {
    setBurgerActive(false);
  };

  // Change header background on scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= 5);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fixed Navbar Menu on Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isBurgerActive) {
        setBurgerActive(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isBurgerActive]);

  useEffect(() => {
    if (isBurgerActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset to default on unmount
    };
  }, [isBurgerActive]);
  return (
    <header
      className={`${styles.header}  ${
        isBurgerActive
          ? styles.offScroll
          : `${isScrolled ? styles.onScroll : ""}`
      } `}
      id="header"
    >
      <nav className={`${styles.navbar} ${styles.container}`}>
        <a href="/" className={`${styles.brand}`}>
          AFront
        </a>
        <div
          className={`${styles.burger} ${
            isBurgerActive ? styles.isActive : ""
          }`}
          id="burger"
          onClick={toggleMenu}
        >
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
          <span className={styles.burgerLine}></span>
        </div>
        <div
          className={`${styles.menu} ${
            isBurgerActive ? styles.isActive : styles.isInActive
          }`}
          id="menu"
        >
          <ul className={styles.menuInner}>
            <li className={styles.menuItem}>
              <a
                href="#"
                className={`${styles.menuLink} ${isBurgerActive ? styles.menuLinkMobile : ""}`}
                onClick={closeMenu}
              >
                Learn
              </a>
            </li>
            <li className={styles.menuItem}>
              <a
                href="#"
                className={`${styles.menuLink} ${isBurgerActive ? styles.menuLinkMobile : ""}`}
                onClick={closeMenu}
              >
                Feature
              </a>
            </li>
            <li className={styles.menuItem}>
              <a
                href="#"
                className={`${styles.menuLink} ${isBurgerActive ? styles.menuLinkMobile : ""}`}
                onClick={closeMenu}
              >
                Blog
              </a>
            </li>
            <li className={styles.menuItem}>
              <a
                href="/support"
                className={`${styles.menuLink} ${isBurgerActive ? styles.menuLinkMobile : ""}`}
                onClick={closeMenu}
              >
                Support
              </a>
            </li>
            {isBurgerActive && (
              <>
                <li className={styles.menuItem}>
                  <a
                    href="#"
                    className={`${styles.menuLink} ${
                      isBurgerActive ? styles.menuLinkMobile : ""
                    }`}
                    onClick={closeMenu}
                  >
                    demo
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
        <a href="/" className={styles.menuBlock}>
          Get Started
        </a>
      </nav>
    </header>
  );
};

export default Header;
