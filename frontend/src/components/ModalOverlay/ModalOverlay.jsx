import "./ModalOverlay.css";
import { useEffect } from "react";

function ModalOverlay({ closeModal }) {
  useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const navBar = document.querySelector(".Navigation");
    const themeToggle = document.querySelector(".ThemeToggle");

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (navBar) {
      navBar.style.paddingRight = `${scrollbarWidth}px`;
    }
    if (themeToggle) {
      themeToggle.style.display = "none";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";

      if (navBar) {
        navBar.style.paddingRight = "0px";
      }
      if (themeToggle) {
        themeToggle.style.display = "flex";
      }
    };
  }, []);

  return <div className="ModalOverlay" onClick={closeModal} />;
}

export default ModalOverlay;
