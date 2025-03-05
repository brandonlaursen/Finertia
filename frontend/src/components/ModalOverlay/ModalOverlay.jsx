import "./ModalOverlay.css";

function ModalOverlay({ closeModal }) {
  return <div className="ModalOverlay" onClick={closeModal} />;
}

export default ModalOverlay;
