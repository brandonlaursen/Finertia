import "./WelcomePageNavbar.css";

import { FaSpaceShuttle } from "react-icons/fa";

import { Link } from "react-router-dom";

function WelcomePageNavbar() {
  return (
    <nav className="WelcomePageNavbar">
      <Link className="WelcomePageNavbar__logo" to="/welcome">
        <FaSpaceShuttle />
        {/* <img src="/favicon.ico" alt="Logo" width="24" /> */}
        Finertia
      </Link>

      <ul className="WelcomePageNavbar__menu">
        <li>
          <Link
            className="WelcomePageNavbar__menu-item login-button"
            to="/login"
          >
            Log in
          </Link>
        </li>

        <li>
          <Link
            className="WelcomePageNavbar__menu-item signup-button"
            to="/signup"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default WelcomePageNavbar;
