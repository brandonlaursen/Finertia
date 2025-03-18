import "./EditProfileModal.css";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";

import { useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";

import ModalHeader from "../../components/ModalHeader/ModalHeader";
import ModalOverlay from "../../components/ModalOverlay/ModalOverlay";

import { editUser } from "../../../store/session";
import { useModal } from "../../context/Modal";

import { useAccentTheme } from "../../context/AccentThemeContext";

function EditProfileModal({ sessionUser }) {
  const dispatch = useDispatch();

  const { closeModal } = useModal();

  const { toggleAccentTheme, selectedAccentTheme } = useAccentTheme();

  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const [userName, setUserName] = useState(sessionUser.username);
  const [image, setImage] = useState(sessionUser.profilePic);

  const [preview, setPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [newAccentTheme, setNewAccentTheme] = useState(selectedAccentTheme);

  const [slideUp, setSlideUp] = useState(false);

  useEffect(() => {
    setSlideUp(true);
  }, []);

  const DEFAULT_IMAGE =
    "https://finertia.s3.amazonaws.com/public/1739990232538.png";

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    toggleAccentTheme(newAccentTheme);

    const editedProfile = {
      username: userName,
      ...(image instanceof File || image === DEFAULT_IMAGE ? { image } : {}),
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
      setPreview(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetImage = () => {
    setImage(DEFAULT_IMAGE);
    setPreviewImage(DEFAULT_IMAGE);
    setPreview(true);
  };

  function handleAccentTheme(color) {
    setNewAccentTheme(color);
  }

  return (
    <div className="EditProfileModal">
      <ModalOverlay closeModal={closeModal} />
      <div className={`EditProfileModal__container ${slideUp ? "open" : ""}`}>
        <ModalHeader closeModal={closeModal}>Edit Profile</ModalHeader>

        <section className="EditProfileModal__section">
          <div className="EditProfileModal___user__image">
            {preview ? (
              <>
                <img
                  src={previewImage || DEFAULT_IMAGE}
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
                {image !== DEFAULT_IMAGE && (
                  <IoCloseCircleOutline
                    className="EditProfileModal___user__plus-icon"
                    onClick={handleResetImage}
                  />
                )}
                {image === DEFAULT_IMAGE && (
                  <FiPlusCircle
                    className="EditProfileModal___user__plus-icon"
                    onClick={handleIconClick}
                  />
                )}
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={updateFile}
              style={{ display: "none" }}
              accept="image/*"
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
              {[
                "rgb(7, 222, 150)",
                "rgb(0, 200, 5)",
                "rgb(0, 188, 212)",
                "rgb(0, 127, 245)",
                "rgb(230, 190, 255)",
                "rgb(136, 58, 234)",
                "rgb(220, 38, 38)",
                "rgb(218, 65, 107)",
                "rgb(255, 105, 97)",
                "rgb(255, 80, 1)",
                "rgb(255, 193, 7)",
                "rgb(45, 45, 45)",
              ].map((color) => (
                <div
                  key={color}
                  className="EditProfileModal__color-btn"
                  style={{ backgroundColor: color }}
                  onClick={() => handleAccentTheme(color)}
                >
                  {newAccentTheme === color && (
                    <IoIosCheckmarkCircle
                      className="EditProfileModal__check-mark"
                      style={{ color: color }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="EditProfileModal__section__save">
            <button
              className="EditProfileModal__section_save-button"
              onClick={handleSubmit}
              style={{ backgroundColor: newAccentTheme }}
            >
              {isLoading ? (
                <span className="StockTransaction__spinner"></span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default EditProfileModal;
