import "./MobileNavigationBar.css";
import { FaUserAstronaut } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";
import { FaSpaceShuttle } from "react-icons/fa";

import MobileSearch from "./MobileSearch/MobileSearch";

import { useState } from "react";
import { Link } from "react-router-dom";

function MobileNavigationBar() {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <nav className="MobileNavigationBar">
      <Link to="/" className="MobileNavigationBar__button">
        <FaSpaceShuttle className="MobileNavigationBar__icon" />
      </Link>

      <span className="MobileNavigationBar__button">
        <FaListAlt className="MobileNavigationBar__icon" />
      </span>

      <span
        className="MobileNavigationBar__button"
        onClick={() => setShowSearch(!showSearch)}
      >
        <IoSearch className="MobileNavigationBar__icon" />
      </span>

      {showSearch && <MobileSearch />}

      <Link to="/stocks" className="MobileNavigationBar__button">
        <MdOutlineExplore className="MobileNavigationBar__icon" />
      </Link>

      <Link to="/profile" className="MobileNavigationBar__button">
        <FaUserAstronaut className="MobileNavigationBar__icon" />
      </Link>
    </nav>
  );
}

export default MobileNavigationBar;
