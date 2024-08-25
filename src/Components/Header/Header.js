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
      className={`header  ${
        isBurgerActive ? "off-scroll" : `${isScrolled ? "on-scroll" : ""}`
      } `}
      id="header"
    >
      <nav className="navbar container">
        <a href="/" className="brand">
          AFront
        </a>
        <div
          className={`burger ${isBurgerActive ? "is-active" : ""}`}
          id="burger"
          onClick={toggleMenu}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>
        <div
          className={`menu ${isBurgerActive ? "is-active " : "is-inactive"}`}
          id="menu"
        >
          <ul className="menu-inner">
            <li className="menu-item">
              <a
                href="#"
                className={`menu-link ${
                  isBurgerActive ? "menu-link-mobile" : ""
                }`}
                onClick={closeMenu}
              >
                Learn
              </a>
            </li>
            <li className="menu-item">
              <a
                href="#"
                className={`menu-link ${
                  isBurgerActive ? "menu-link-mobile" : ""
                }`}
                onClick={closeMenu}
              >
                Feature
              </a>
            </li>
            <li className="menu-item">
              <a
                href="#"
                className={`menu-link ${
                  isBurgerActive ? "menu-link-mobile" : ""
                }`}
                onClick={closeMenu}
              >
                Blog
              </a>
            </li>
            <li className="menu-item">
              <a
                href="/support"
                className={`menu-link ${
                  isBurgerActive ? "menu-link-mobile" : ""
                }`}
                onClick={closeMenu}
              >
                Support
              </a>
            </li>
            {isBurgerActive && (
              <>
                <li className="menu-item">
                  <a
                    href="#"
                    className={`menu-link ${
                      isBurgerActive ? "menu-link-mobile" : ""
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
        <a href="/" className="menu-block">
          Get Started
        </a>
      </nav>
    </header>
  );
};

export default Header;
