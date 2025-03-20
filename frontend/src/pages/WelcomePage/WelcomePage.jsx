import "./WelcomePage.css";

import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import WelcomePageNavbar from "./WelcomePageNavbar";
import WelcomePageFooter from "./WelcomePageFooter";

import { selectUser } from "../../../store/session";

function WelcomePage() {
  const sessionUser = useSelector(selectUser);
  const navigate = useNavigate();

  return (
    <div className="WelcomePage">
      <WelcomePageNavbar />

      <section className="WelcomePage__section WelcomePage__hero">
        <div className="WelcomePage__hero-title">
          <img
            src="/favicon3.png"
            alt="Logo"
            width="20"
            className="WelcomePage__logo"
          />
          <span>Welcome to Finertia</span>
        </div>

        <div className="WelcomePage__hero-highlight">
          <h1>
            &quot;Defy inertia—simulate, strategize, and keep your investments
            in motion.&quot;
          </h1>
          {sessionUser ? null : (
            <Link to="/signup">
              <button className="WelcomePage__hero-button">Get Started</button>
            </Link>
          )}
        </div>

        <section className="WelcomePage__mobile-buttons">
          <button
            className="WelcomePage__mobile-button WPM-login-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="WelcomePage__mobile-button WPM-signup-btn"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </section>
      </section>

      <WelcomePageFooter />
    </div>
  );
}

export default WelcomePage;
