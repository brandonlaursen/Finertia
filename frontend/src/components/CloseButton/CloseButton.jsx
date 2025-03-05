import "./CloseButton.css";
import { MdClose } from "react-icons/md";

function CloseButton({ closeModal }) {
  return (
    <button className="CloseButton__container">
      <MdClose className="CloseButton__icon" onClick={closeModal} />
    </button>
  );
}

export default CloseButton;
