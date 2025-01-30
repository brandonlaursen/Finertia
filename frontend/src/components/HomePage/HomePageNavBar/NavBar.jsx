import "./NavBar.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Outlet, Navigate, NavLink } from "react-router-dom";

import SearchBar from "./SearchBar/SearchBar";
import HamburgerMenu from "./HamburgerMenu/HamburgerMenu";
import AccountDropdown from "./AccountDropdown/AccountDropdown";

import { selectUser } from "../../../../store/session";

function NavBar() {
  // const location = useLocation();
  // const routeClass =
  //   location.pathname === "/stocks" ? "all-stocks-nav" : "home-page-navbar";

  const sessionUser = useSelector(selectUser);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!sessionUser) return <Navigate to="/welcome" replace={true} />;

  return (
    <>
      <nav className={"home-page-navbar"}>
        {/* <NavLink to="/"> */}
        <NavLink className="search-bar-logo-container">
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
