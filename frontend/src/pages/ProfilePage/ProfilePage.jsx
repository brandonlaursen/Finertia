import "./ProfilePage.css";
import { LuInfo } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FiPlusCircle } from "react-icons/fi";
import { PiSpinner } from "react-icons/pi";

import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectUser, editUser } from "../../../store/session";

import { useModal } from "../../context/Modal";

import EditProfileModal from "../../modals/EditProfileModal/EditProfileModal";

const DEFAULT_IMAGE =
  "https://finertia.s3.amazonaws.com/public/1739990232538.png";

function ProfilePage() {
  const sessionUser = useSelector(selectUser);

  const dispatch = useDispatch();

  const { setModalContent, setModalClass } = useModal();
  const { stockSummary } = sessionUser;

  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(sessionUser.profilePic);

  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  console.log(stockSummary);
  const total = stockSummary.totalInvestments + stockSummary.balance;
  console.log(total);
  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        <div className="ProfilePage__user">
          <div className="ProfilePage__user__image">
            {isLoading ? (
              <div>
                <img
                  src={profilePic}
                  alt="User Profile"
                  className={`EditProfileModal___user__profile-pic ${
                    isLoading && "profile-blur"
                  }`}
                />
                <PiSpinner className="ProfilePage__spinner" />
              </div>
            ) : (
              <img
                src={profilePic}
                alt="User Profile"
                className="EditProfileModal___user__profile-pic"
              />
            )}

            {profilePic !== DEFAULT_IMAGE ? (
              <IoCloseCircleOutline
                className="ProfilePage__user__plus-icon"
                onClick={handleRemoveImage}
              />
            ) : (
              <FiPlusCircle
                className="ProfilePage__user__plus-icon"
                onClick={handleIconClick}
              />
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>

          <div className="ProfilePage__user__information">
            <div className="ProfilePage__user__information__name">
              {`${sessionUser.firstName} ${sessionUser.lastName}`}
            </div>
            <div>
              <span className="ProfilePage__user__information__username">
                @{sessionUser.username}
              </span>
              ·
              <span className="ProfilePage__user__information__join-date">
                {`Joined ${sessionUser.joinDate.split("-")[0]}`}
              </span>
            </div>
            <span
              className="ProfilePage__user__information__edit"
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
          </div>
        </div>

        <div className="ProfilePage__total">
          <span className="ProfilePage__total__balance">
            ${stockSummary?.balance?.toFixed(2)}
          </span>
          Total in Finertia
        </div>

        <div className="ProfilePage__investments">
          <div className="ProfilePage__investments__header">
            <span className="ProfilePage__investments__header__text">
              Individual Investing
            </span>
            <LuInfo className="ProfilePage__investments__header__info-icon" />
          </div>

          <div className="ProfilePage__investments__details">
            <div className="ProfilePage__investments__details__value">
              <span className="ProfilePage__investments__details__value-text">
                Total Individual value
              </span>
              <span className="ProfilePage__investments__details__value-subtext">
                {" "}
                ${total ? total.toFixed(2) : ""}
              </span>
            </div>

            <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
              <span>Individual holdings</span>$
              {stockSummary.totalInvestments.toFixed(2)}
            </div>

            <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
              <span>Individual cash</span>${stockSummary.balance.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="ProfilePage__overview">
          <div className="ProfilePage__overview__title">Overview</div>

          <div className="ProfilePage__overview__contents">
            <div className="ProfilePage__overview__button">
              <span>Stocks</span>
              <span className="ProfilePage__overview__percentage">100%</span>
            </div>
            <div className="ProfilePage__overview__button">
              <span>ETFs</span>
              <span className="ProfilePage__overview__percentage">0%</span>
            </div>
            <div className="ProfilePage__overview__button">
              <span>Options</span>
              <span className="ProfilePage__overview__percentage">0%</span>
            </div>
            <div className="ProfilePage__overview__button">
              <span>Crypto</span>
              <span className="ProfilePage__overview__percentage">0%</span>
            </div>
          </div>

          <div className="ProfilePage__overview__description">
            <span className="ProfilePage__description__text">
              Stocks are pieces of a company that investors can own.
            </span>
            <span className="ProfilePage__description__subtext">
              Learn More
            </span>
          </div>
        </div>

        <div className="ProfilePage__buttons">
          <div>Business</div>
          <div>Consumer Goods</div>
          <div>Energy & Water</div>
          <div>Finance</div>
          <div>Healthcare</div>
          <div>Hospitality</div>
          <div>Manufacturing & Materials</div>
          <div>Tech, Media, & Telecom</div>
        </div>

        <div className="ProfilePage__disclaimer">
          <span>
            All investing involves risk, including the loss of principal.
            Brokerage Holdings include securities and related products offered
            by registered broker-dealer Finertia Financial LLC, member SIPC.
            Crypto Holdings are offered by Finertia Crypto, LLC, are not
            securities, and are not covered by SIPC. Finertia Crypto holdings
            are not offered by Finertias broker-dealer and are therefore not
            subject to the same regulatory protections as those offered by
            Finertia Financial...
          </span>
          <span className="ProfilePage__disclaimer__show-more">Show More</span>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
