import "./NavigationBar.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  useLocation,
  Outlet,
  Navigate,
  NavLink,
  useNavigate,
} from "react-router-dom";

import SearchBar from "../SearchBar/SearchBar";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";
import AccountDropdown from "../AccountDropdown/AccountDropdown";

import { selectUser } from "../../../../store/session";

function NavigationBar() {
  const location = useLocation();
  const routeClass =
    location.pathname === "/stocks" ? "stocks-nav" : "Navigation";

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".Stocks__banner");
      if (header) {
        const offset = header.getBoundingClientRect().top;
        setScrolled(offset <= 74);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [routeClass]);

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <>
      <nav className={`${routeClass} ${scrolled && "scrolled"}`}>
        <NavLink className={`Navigation__logo-container`}>
          <FaSpaceShuttle id="Navigation__logo" />
        </NavLink>

        <SearchBar />

        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <div className={`Navigation__links ${isMenuOpen && "show"}`}>
          <span
            className="NavigationBar__home-btn"
            onClick={() => navigate("/stocks")}
          >
            Home
          </span>
          <AccountDropdown sessionUser={sessionUser} />
        </div>
      </nav>

      <Outlet context={{ scrolled }} />
    </>
  );
}

export default NavigationBar;
