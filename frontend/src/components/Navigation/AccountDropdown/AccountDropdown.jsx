import "./AccountDropdown.css";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { logout } from "../../../../store/session";

function AccountDropdown({ sessionUser }) {
  const dispatch = useDispatch();
  const accountDropdownRef = useRef(null);
  const accountSpanRef = useRef(null);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isActive, setIsActive] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
        setIsActive(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleAccountDropdown = (e) => {
    e.stopPropagation();
    setIsAccountOpen(!isAccountOpen);
  };

  const handleLogout = async (e) => {
    e.stopPropagation();
    await dispatch(logout());
  };


  return (
    <span tabIndex={0} ref={accountDropdownRef} onClick={toggleAccountDropdown}>
      <span
        className={`AccountDropdown__span ${
          isActive ? "AccountDropdown__span__active" : ""
        }`}
        ref={accountSpanRef}
        onClick={() => setIsActive(!isActive)}
      >
        Account
      </span>
      {isAccountOpen && (
        <div className="AccountDropdown">
          <div className="AccountDropdown__user">
            <span>{sessionUser.username}</span>
          </div>

          <div className="AccountDropdown__links">
            <Link to="/profile">
              <MdAccountCircle className="AccountDropdown__icon" />
              Profile
            </Link>
            <Link to="/account/settings/security">
              <IoMdSettings className="AccountDropdown__icon" />
              Settings
            </Link>
            <Link to="/account/help">
              <IoMdHelpCircle className="AccountDropdown__icon" />
              Help
            </Link>
          </div>

          <div className="AccountDropdown__logout">
            <span
              className="AccountDropdown__logout-button"
              onClick={handleLogout}
            >
              <MdOutlineLogin className="AccountDropdown__icon" />
              Log Out
            </span>
          </div>
        </div>
      )}
    </span>
  );
}

export default AccountDropdown;
