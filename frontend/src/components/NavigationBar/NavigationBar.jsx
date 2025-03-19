import "./NavigationBar.css";
// import { FaSpaceShuttle } from "react-icons/fa";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, NavLink, useNavigate } from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import AccountDropdown from "./AccountDropdown/AccountDropdown";
import HamburgerDropdown from "./HamburgerDropdown";

import { selectUser } from "../../../store/session";

function NavigationBar({ scrolled }) {
  const location = useLocation();
  const routeClass =
    location.pathname === "/stocks" ? "stocks-nav" : "Navigation";

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // * Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <nav className={`${routeClass} ${scrolled && "scrolled"}`}>
      <NavLink className={`Navigation__logo-container`}>
      <img src="/public/favicon3.png" alt="Logo" width="24" />
      </NavLink>

      <SearchBar />

      <div ref={menuRef} className="HamburgerMenu__wrapper">
        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        {isMenuOpen && (
          <HamburgerDropdown
            navigate={navigate}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </div>

      <div className={`Navigation__links ${isMenuOpen && "show"}`}>
        <span
          className="NavigationBar__home-btn"
          onClick={() => navigate("/stocks")}
        >
          Explore
        </span>
        <AccountDropdown sessionUser={sessionUser} />
      </div>
    </nav>
  );
}

export default NavigationBar;
