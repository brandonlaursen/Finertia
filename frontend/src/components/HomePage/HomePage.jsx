import "./HomePage.css";
import { FaSpaceShuttle } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoMdHelpCircle } from "react-icons/io";
import { MdOutlineLogin } from "react-icons/md";

import { useState, useEffect, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectUser, restoreUser, logout } from "../../../store/session";

function HomePage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectUser);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      await dispatch(restoreUser());
    };

    loadUser();
  }, [dispatch]);

  if (!sessionUser) return <Navigate to="/" replace />;

  // const toggleHamburgerMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };

  return (
    <div className="home-page-container">
      <nav className="home-page-navbar">
        <div className="search-bar-logo-container">
          {" "}
          <FaSpaceShuttle id="shuttle-logo" />
        </div>
        <SearchBar />
        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        <div
          className={`home-page-nav-links-container ${
            isMenuOpen ? "show" : ""
          }`}
        >
          <Link>Stocks</Link>
          <Link>Investing</Link>
          <Link>About</Link>
          <Link>Notifications</Link>
          <AccountDropdown sessionUser={sessionUser} />
        </div>
      </nav>

      {/* Body */}
      <div className="home-page-body"></div>

      
    </div>
  );
}

function AccountDropdown({ sessionUser }) {
  const dispatch = useDispatch();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // only close dropdown if the link click is outside the account link container
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
      <Link>Account</Link>
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

function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="search-bar-container">
      <IoSearch id="search-icon" />
      <input
        className="search-bar"
        placeholder="Search"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      ></input>
      {isFocused && (
        <ul className="search-results">
          <li>Stocks</li>
          <li>Search Result 1</li>
          <li>Search Result 2</li>
          <li>Search Result 3</li>
          <li>Search Result 4</li>
        </ul>
      )}
    </div>
  );
}

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  const toggleHamburgerMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="hamburger-icon-container">
      {isMenuOpen ? (
        <IoClose
          className="hamburger-icon close-icon"
          onClick={toggleHamburgerMenu}
          onBlur={() => setIsMenuOpen(false)}
        />
      ) : (
        <GiHamburgerMenu
          className="hamburger-icon"
          onClick={toggleHamburgerMenu}
        />
      )}
    </div>
  );
}
export default HomePage;
