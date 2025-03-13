import "./HomePageBuyingPower.css";
import { FaAngleDown } from "react-icons/fa6";

import { useState } from "react";

import BuyingPowerDropDown from "../BuyingPowerDropDown";

function HomePageBuyingPower({
  sessionUser,
  setNotifications,
  setNotificationMessage,
  notifications,
  notificationMessage,
}) {
  const [isDropDownVisible, setDropDownIsVisible] = useState(false);

  const balanceRaw = sessionUser?.stockSummary?.balance;
  const balance = !isNaN(balanceRaw) ? Number(balanceRaw) : 0;

  const props = {
    setNotifications,
    setNotificationMessage,
    notifications,
    notificationMessage,
    balance,
  };

  return (
    <div
      className={`HomePageBuyingPower ${
        isDropDownVisible && "HomePageBuyingPower--highlight"
      }`}
    >
      <div
        className="HomePageBuyingPower__toggle"
        onClick={() => setDropDownIsVisible(!isDropDownVisible)}
      >
        <span>Buying Power</span>
        <span className="HomePageBuyingPower__balance">
          ${balance ? balance.toFixed(2) : 0}
          <FaAngleDown
            className={`HomePageBuyingPower__arrow-icon ${
              isDropDownVisible && "open"
            }`}
          />
        </span>
      </div>

      {isDropDownVisible && <BuyingPowerDropDown {...props} />}
    </div>
  );
}

export default HomePageBuyingPower;
