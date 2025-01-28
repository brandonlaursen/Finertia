import './AccountDropdown.css'
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";

import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { logout } from "../../../../../store/session";

function AccountDropdown({ sessionUser }) {
  const dispatch = useDispatch();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(event.target)
      ) {
        setIsAccountOpen(false);
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
      <span>Account</span>
      {isAccountOpen && (
        <div className="account-dropdown-container">
          <div className="account-dropdown-user">
            <span>{sessionUser.username}</span>
          </div>
          <div className="account-dropdown-link-container">
            <Link to="/account">
              <MdAccountCircle />
              Profile
            </Link>

            <Link to="/settings">
              <IoMdSettings />
              Settings
            </Link>
            <Link to="/help">
              <IoMdHelpCircle />
              Help
            </Link>
          </div>
          <div className="account-dropdown-logout">
            <span id="account-logout" onClick={handleLogout}>
              <MdOutlineLogin />
              Log Out
            </span>
          </div>
        </div>
      )}
    </span>
  );
}

export default AccountDropdown;
