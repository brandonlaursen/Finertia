import "./EditProfileModal.css";

import { useModal } from "../../../context/Modal";

function EditProfileModal(user) {
  const { closeModal } = useModal();

  console.log("user:", user);
  return (
    <div className="EditProfileModal">
      <div className="EditProfileModal__background" onClick={closeModal}></div>
      <div className="EditProfileModal__container">
        <h1>EditProfileModal</h1>
      </div>
    </div>
  );
}

export default EditProfileModal;
