import "./CloseButton.css";
import { MdClose } from "react-icons/md";

function CloseButton({ closeModal, clearNotifications }) {

  const handleClick = () => {
    if (closeModal) closeModal();
    if (clearNotifications) clearNotifications();
  };

  return (
    <button className="CloseButton__container">
      <MdClose className="CloseButton__icon" onClick={handleClick} />
    </button>
  );
}

export default CloseButton;
