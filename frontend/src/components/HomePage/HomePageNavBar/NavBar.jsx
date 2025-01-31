import "./NavBar.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Outlet, Navigate, NavLink } from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import AccountDropdown from "./AccountDropdown/AccountDropdown";

import { selectUser } from "../../../../store/session";

function NavBar() {
  const location = useLocation();
  const routeClass =
    location.pathname === "/stocks" ? "stocks-nav" : "home-page-navbar";

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);
  console.log("scrolled:", scrolled);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".stocks__header");
      if (header) {
        const offset = header.getBoundingClientRect().top;
        setScrolled(offset <= 80); // Change when header is near top
      }
    };


      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    
  }, [routeClass]);

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <>
      <nav className={`${routeClass} ${scrolled ? "scrolled" : ""}`}>
        {/* <NavLink to="/"> */}
        <NavLink className={`search-bar-logo-container`}>
          {" "}
          <FaSpaceShuttle id="shuttle-logo" />
        </NavLink>
        {/* </NavLink> */}

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
      <Outlet />
    </>
  );
}

export default NavBar;
