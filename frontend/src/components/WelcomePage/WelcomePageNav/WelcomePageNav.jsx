import "./WelcomePageNav.css";

import { useNavigate } from "react-router-dom";
import { FaSpaceShuttle } from "react-icons/fa";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { selectUser } from "../../../../store/session";

function WelcomePageNav() {
  const navigate = useNavigate();

  const sessionUser = useSelector(selectUser);

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate("/")}>
        {" "}
        <FaSpaceShuttle />
        Finertia
      </div>
      <div className="navbar-center">
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
      </div>

      <div className="navbar-right">
        {sessionUser ? (
          <button className="nav-btn account"> My Account</button>
        ) : (
          <>
            <button
              className="nav-btn login"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className="nav-btn signup"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default WelcomePageNav;
