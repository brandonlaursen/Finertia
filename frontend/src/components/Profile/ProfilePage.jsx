import "./ProfilePage.css";
import { FaSmile } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { LuInfo } from "react-icons/lu";
// import { GoDash } from "react-icons/go";

import { useSelector } from "react-redux";
import { selectUser } from "../../../store/session";

import { useModal } from "../../context/Modal";

import EditProfileModal from "./EditProfileModal/EditProfileModal";

function ProfilePage() {
  const sessionUser = useSelector(selectUser);
  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="ProfilePage">
      <div className="ProfilePage__container">
        <div className="ProfilePage__user">
          
          <div className="ProfilePage__user__image">
            <FaSmile className="ProfilePage__user__profile-pic" />
            <FiPlusCircle className="ProfilePage__user__plus-icon" />
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
                setModalContent(<EditProfileModal user={sessionUser} />);
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
            ${sessionUser.balance}
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
              {/* <GoDash className="ProfilePage__investments__details__dash" />
               */}
              ${sessionUser.balance}
            </div>

            <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
              <span>Individual holdings</span>
              {/* <GoDash className="ProfilePage__investments__details__dash" /> */}
              ${sessionUser.balance}
            </div>

            <div className="ProfilePage__investments__details__value ProfilePage__investments__details__subtext">
              <span>Individual cash</span>
              {/* <GoDash className="ProfilePage__investments__details__dash" /> */}
              ${sessionUser.balance}
            </div>
          </div>
        </div>

        <div className="ProfilePage__overview">
          <div className="ProfilePage__overview__title">Overview</div>

          <div className="ProfilePage__overview__contents">
            <div className="ProfilePage__overview__button">
              <span>Stocks</span>
              <span className="ProfilePage__overview__percentage">0%</span>
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
