import "./ProfilePageUserInfo.css";
import { PiSpinner } from "react-icons/pi";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";

import { useState, useRef, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { selectUser, editUser } from "../../../../store/session";

import { useModal } from "../../../context/Modal";

import EditProfileModal from "../../../modals/EditProfileModal/EditProfileModal";

import Skeleton from "../../../components/Skeleton";

const DEFAULT_IMAGE =
  "https://finertia.s3.amazonaws.com/public/1739990232538.png";

function ProfilePageUserInfo() {
  const sessionUser = useSelector(selectUser);

  const dispatch = useDispatch();

  const { setModalContent, setModalClass } = useModal();
  const [loadingProfilePic, setLoadingProfilePic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [profilePic, setProfilePic] = useState(sessionUser.profilePic);

  useEffect(() => {
    setProfilePic(sessionUser.profilePic);
  }, [sessionUser.profilePic]);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    setProfilePic(DEFAULT_IMAGE);
    await dispatch(editUser({ username: sessionUser.username, image: null }));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const editedProfile = {
      username: sessionUser.username,
      image: file,
    };

    await dispatch(editUser(editedProfile));

    setLoadingProfilePic(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoadingProfilePic(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  setTimeout(() => {
    setIsLoading(false);
  }, 1000);

  if (isLoading) {
    return (
      <div className="ProfilePageUserInfo">
        <section className="ProfilePageUserInfo__profile-pic-container">
          <Skeleton
            className="ProfilePageUserInfo__profile-skeleton"
            height="72px"
            width="72px"
            borderRadius="50%"
          />
        </section>

        <section className="ProfilePageUserInfo__information">
          <Skeleton width="160px" height="30px" />
          <Skeleton width="100px" height="16px" />
        </section>
      </div>
    );
  }

  return (
    <div className="ProfilePageUserInfo">
      <section className="ProfilePageUserInfo__profile-pic-container">
        {loadingProfilePic ? (
          <div>
            <img
              src={profilePic}
              alt="User Profile"
              className={`ProfilePageUserInfo__profile-pic ${
                loadingProfilePic && "ProfilePageUserInfo--profile-blur"
              }`}
            />
            <PiSpinner className="ProfilePageUserInfo__spinner" />
          </div>
        ) : (
          <img
            src={profilePic}
            alt="User Profile"
            className="ProfilePageUserInfo__profile-pic"
          />
        )}

        {profilePic !== DEFAULT_IMAGE ? (
          <IoCloseCircleOutline
            className="ProfilePageUserInfo__plus-icon"
            onClick={handleRemoveImage}
          />
        ) : (
          <FiPlusCircle
            className="ProfilePageUserInfo__plus-icon"
            onClick={handleIconClick}
          />
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </section>

      <section className="ProfilePageUserInfo__information">
        <div className="ProfilePageUserInfo__information__name">
          {`${sessionUser.firstName} ${sessionUser.lastName}`}
        </div>
        <div>
          <span className="ProfilePageUserInfo__information__username">
            @{sessionUser.username}
          </span>
          ·
          <span className="ProfilePageUserInfo__information__join-date">
            {`Joined ${sessionUser.joinDate.split("-")[0]}`}
          </span>
        </div>

        <span
          className="ProfilePageUserInfo__information__edit"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setModalContent(<EditProfileModal sessionUser={sessionUser} />);
            setModalClass({
              modal: "EditProfileModal",
              modalBackground: "EditProfileModal__background",
              modalContainer: "EditProfileModal__container",
            });
          }}
        >
          Edit profile
        </span>
      </section>
    </div>
  );
}

export default ProfilePageUserInfo;
