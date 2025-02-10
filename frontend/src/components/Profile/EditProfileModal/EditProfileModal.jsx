import "./EditProfileModal.css";
import { MdClose } from "react-icons/md";
import { FaSmile } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";

import { useModal } from "../../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { editUser } from "../../../../store/session";

function EditProfileModal(user) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [userName, setUserName] = useState(sessionUser.username);
  const [profilePic, setProfilePic] = useState(sessionUser.profilePic);

  console.log("user:", user);

  async function handleSubmit(e) {
    e.preventDefault();

    const editedProfile = {
      username: userName,
      profilePic
    };

    console.log(editedProfile);
    await dispatch(editUser(editedProfile));
    closeModal();
  }

  return (
    <div className="EditProfileModal">
      <div className="EditProfileModal__background" onClick={closeModal}></div>
      <div className="EditProfileModal__container">
        <div className="EditProfileModal__header">
          <span className="EditProfileModal__header__title">Edit Profile</span>
          <span className="EditProfileModal__close-button-span">
            <MdClose
              className="EditProfileModal__close-button"
              onClick={closeModal}
            />
          </span>
        </div>

        <div className="EditProfileModal__section">
          <div className="EditProfileModal___user__image">
            <FaSmile className="EditProfileModal___user__profile-pic" />
            <FiPlusCircle className="EditProfileModal___user__plus-icon" />
          </div>

          <div className="EditProfileModal__user__info">
            <span className="EditProfileModal__user__info-title">Username</span>
            <input
              className="EditProfileModal__user__info-input"
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div className="EditProfileModal__section__theme">
            <span className="EditProfileModal__section__title">Theme</span>
            <div className="EditProfileModal__section-selector">
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
              <div className="EditProfileModal__color-btn"></div>
            </div>
          </div>

          <div className="EditProfileModal__section__save">
            <button
              className="EditProfileModal__section_save-button"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
