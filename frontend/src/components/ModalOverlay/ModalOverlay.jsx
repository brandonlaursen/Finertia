import "./ModalOverlay.css";
import { useEffect } from "react";

function ModalOverlay({ closeModal }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return <div className="ModalOverlay" onClick={closeModal} />;
}

export default ModalOverlay;
