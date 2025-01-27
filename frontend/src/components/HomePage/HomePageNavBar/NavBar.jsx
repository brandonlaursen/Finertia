
import './NavBar.css';
import { FaSpaceShuttle } from "react-icons/fa";

import { useState } from "react";
import { Link } from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import AccountDropdown from "./AccountDropdown/AccountDropdown";

function NavBar({ sessionUser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="home-page-navbar">
      <div className="search-bar-logo-container">
        {" "}
        <FaSpaceShuttle id="shuttle-logo" />
      </div>
      <SearchBar />
      <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <div
        className={`home-page-nav-links-container ${isMenuOpen ? "show" : ""}`}
      >
        <Link>Stocks</Link>
        <Link>Investing</Link>
        <Link>About</Link>
        <Link>Notifications</Link>
        <AccountDropdown sessionUser={sessionUser} />
      </div>
    </nav>
  );
}

export default NavBar;
