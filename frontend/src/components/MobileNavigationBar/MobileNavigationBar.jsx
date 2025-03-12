import "./MobileNavigationBar.css";
import { FaUserAstronaut } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { FaListAlt } from "react-icons/fa";
import { FaSpaceShuttle } from "react-icons/fa";

import MobileSearch from "./MobileSearch/MobileSearch";
import MobileListSideBar from "./MobileListSideBar/MobileListSideBar";

import { useState } from "react";
import { Link } from "react-router-dom";

function MobileNavigationBar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showListSideBar, setShowListSideBar] = useState(false);

  const handleLinkClick = () => {
    setShowSearch(false);
    setShowListSideBar(false);
  };

  return (
    <nav className="MobileNavigationBar">
      <Link
        to="/"
        className="MobileNavigationBar__button"
        onClick={handleLinkClick}
      >
        <FaSpaceShuttle className="MobileNavigationBar__icon" />
      </Link>

      <span
        className="MobileNavigationBar__button"
        onClick={() => {
          setShowListSideBar(!showListSideBar), setShowSearch(false);
        }}
      >
        <FaListAlt className="MobileNavigationBar__icon" />
      </span>
      {showListSideBar && (
        <MobileListSideBar
          setShowListSideBar={setShowListSideBar}
          showListSideBar={showListSideBar}
        />
      )}

      <span
        className="MobileNavigationBar__button"
        onClick={() => {
          setShowSearch(!showSearch), setShowListSideBar(false);
        }}
      >
        <IoSearch className="MobileNavigationBar__icon" />
      </span>

      {showSearch && <MobileSearch setShowSearch={setShowSearch} />}

      <Link
        to="/stocks"
        className="MobileNavigationBar__button"
        onClick={handleLinkClick}
      >
        <MdOutlineExplore className="MobileNavigationBar__icon" />
      </Link>

      <Link
        to="/profile"
        className="MobileNavigationBar__button"
        onClick={handleLinkClick}
      >
        <FaUserAstronaut className="MobileNavigationBar__icon" />
      </Link>
    </nav>
  );
}

export default MobileNavigationBar;
