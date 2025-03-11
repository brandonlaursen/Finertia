import "./NavigationBar.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { useState } from "react";
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

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <nav className={`${routeClass} ${scrolled && "scrolled"}`}>
      <NavLink className={`Navigation__logo-container`}>
        <FaSpaceShuttle id="Navigation__logo" />
      </NavLink>

      <SearchBar />

      <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {isMenuOpen && <HamburgerDropdown navigate={navigate} />}

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
