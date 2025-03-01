import "./EditProfileModal.css";
import { MdClose } from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";

import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";

import { editUser } from "../../../../store/session";

function EditProfileModal({ sessionUser }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [userName, setUserName] = useState(sessionUser.username);
  const [image, setImage] = useState(sessionUser.profilePic);

  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(
    "https://finertia.s3.amazonaws.com/public/1739990232538.png"
  );

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    const editedProfile = {
      username: userName,
      image,
    };

    await dispatch(editUser(editedProfile));
    closeModal();
  }

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const updateFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="EditProfileModal">
      <div className="EditProfileModal__background" onClick={closeModal}></div>
      <div className="EditProfileModal__container">
        <div className="EditProfileModal__header">
          <span className="EditProfileModal__header__title">Edit Profile</span>
          <span className="EditProfileModal__close-button-span">
            <MdClose
              className="EditProfileModal__close-button"
              onClick={() => {
                closeModal();
              }}
            />
          </span>
        </div>

        <div className="EditProfileModal__section">
          <div className="EditProfileModal___user__image">
            {preview ||
            sessionUser.profilePic ===
              "https://finertia.s3.amazonaws.com/public/1739990232538.png" ? (
              <>
                <img
                  src={previewImage}
                  alt="User Profile"
                  className="EditProfileModal___user__profile-pic"
                />

                <FiPlusCircle
                  className="EditProfileModal___user__plus-icon"
                  onClick={handleIconClick}
                />
              </>
            ) : (
              <>
                <img
                  src={image}
                  alt="User Profile"
                  className="EditProfileModal___user__profile-pic"
                />
                <IoCloseCircleOutline
                  className="EditProfileModal___user__plus-icon"
                  onClick={() => {
                    setPreview(true);
                  }}
                />
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={updateFile}
              style={{ display: "none" }}
            />
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
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfileModal;
