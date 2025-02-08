import "./Navigation.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, Outlet, Navigate, NavLink } from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import AccountDropdown from "./AccountDropdown/AccountDropdown";

import { selectUser } from "../../../store/session";

function Navigation() {
  const location = useLocation();
  const routeClass =
    location.pathname === "/stocks" ? "stocks-nav" : "Navigation";

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".stocks__header");
      if (header) {
        const offset = header.getBoundingClientRect().top;
        setScrolled(offset <= 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [routeClass]);

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <>
      <nav className={`${routeClass} ${scrolled ? "scrolled" : ""}`}>
        <NavLink className={`Navigation__logo__container`}>
          <FaSpaceShuttle id="Navigation__logo" />
        </NavLink>

        <SearchBar />

        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        <div className={`Navigation__links ${isMenuOpen ? "show" : ""}`}>
          <Link to="/stocks">Stocks</Link>
          <Link>Notifications</Link>
          <AccountDropdown sessionUser={sessionUser} />
        </div>
      </nav>

      <Outlet context={{ scrolled }} />
    </>
  );
}

export default Navigation;
