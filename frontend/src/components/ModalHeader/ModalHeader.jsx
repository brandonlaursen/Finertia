import "./ModalHeader.css";

import CloseButton from "../CloseButton/CloseButton";

function ModalHeader({ closeModal, children }) {
  return (
    <header className="ModalHeader__header">
      <span className="ModalHeader__title">
        <span>{children}</span>
      </span>
      <CloseButton closeModal={closeModal} />
    </header>
  );
}

export default ModalHeader;
