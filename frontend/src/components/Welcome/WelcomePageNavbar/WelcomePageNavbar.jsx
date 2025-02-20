import "./WelcomePageNavbar.css";

import { FaSpaceShuttle } from "react-icons/fa";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUser } from "../../../../store/session";

function WelcomePageNavbar() {
  const sessionUser = useSelector(selectUser);

  return (
    <nav className="WelcomePageNavbar">
      <Link className="WelcomePageNavbar__logo" to="/welcome">
        {" "}
        <FaSpaceShuttle />
        Finertia
      </Link>

      {/* <div className="WelcomePageNavbar__links">
        <Link to="/about" className="WelcomePageNavbar__link">
          About
        </Link>
        <Link to="/contact" className="WelcomePageNavbar__link">
          Contact
        </Link>
      </div> */}

      <div className="WelcomePageNavbar__links__buttons">
        {sessionUser ? (
          <button className="WelcomePageNavbar__links__button account-button">
            {" "}
            My Account
          </button>
        ) : (
          <>
            <Link
              className="WelcomePageNavbar__links__button login-button"
              to="/login"
            >
              Log in
            </Link>
            <Link
              className="WelcomePageNavbar__links__button signup-button"
              to="/signup"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default WelcomePageNavbar;
