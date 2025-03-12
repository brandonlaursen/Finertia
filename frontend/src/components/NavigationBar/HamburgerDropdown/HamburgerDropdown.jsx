import "./HamburgerDropdown.css";
import { FaMoneyBill } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import { FaSmile } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { LuHistory } from "react-icons/lu";
import { MdOutlineExplore } from "react-icons/md";

import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { logout } from "../../../../store/session";

const Tooltip = ({ text }) => (
  <span className="Tooltip">
    {text}
    <span className="Tooltip__triangle"></span>
  </span>
);

function HamburgerDropdown({ navigate }) {
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.stopPropagation();
    await dispatch(logout());
  };

  return (
    <div className="HamburgerMenu__drop-down">
      <span
        className="HamburgerDropdown__link"
        onClick={() => navigate("/stocks")}
        data-tooltip="Explore"
      >
        <MdOutlineExplore className="HamburgerDropdown__icon" />
        <Tooltip text="Explore" />
      </span>

      <Link
        className="HamburgerDropdown__link"
        to="/profile"
        data-tooltip="Profile"
      >
        <FaSmile className="HamburgerDropdown__icon" />
        <Tooltip text="Profile" />
      </Link>

      <Link
        className="HamburgerDropdown__link"
        to="/account/investing"
        data-tooltip="Investing"
      >
        <FaMoneyBill className="HamburgerDropdown__icon" />
        <Tooltip text="Investing" />
      </Link>
      <Link
        className="HamburgerDropdown__link"
        to="/account/transfers"
        data-tooltip="Transfers"
      >
        <AiFillBank className="HamburgerDropdown__icon" />
        <Tooltip text="Transfers" />
      </Link>
      <Link
        className="HamburgerDropdown__link"
        to="/account/history"
        data-tooltip="History"
      >
        <LuHistory className="HamburgerDropdown__icon" />
        <Tooltip text="History" />
      </Link>
      <Link
        className="HamburgerDropdown__link"
        to="/account/settings/security"
        data-tooltip="Settings"
      >
        <IoMdSettings className="HamburgerDropdown__icon" />
        <Tooltip text="Settings" />
      </Link>
      <Link
        className="HamburgerDropdown__link"
        to="/account/help"
        data-tooltip="Help"
      >
        <IoMdHelpCircle className="HamburgerDropdown__icon" />
        <Tooltip text="Help" />
      </Link>
      <span
        className="HamburgerDropdown__link"
        onClick={handleLogout}
        data-tooltip="Log Out"
      >
        <LuLogOut className="HamburgerDropdown__icon" />
        <Tooltip text="Log Out" />
      </span>
    </div>
  );
}

export default HamburgerDropdown;
