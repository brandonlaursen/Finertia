import "./WelcomePage.css";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import WelcomePageNavbar from "./WelcomePageNavbar";

import { selectUser } from "../../../store/session";

function WelcomePage() {
  const sessionUser = useSelector(selectUser);

  return (
    <div className="WelcomePage">
      <WelcomePageNavbar />

      <section className="WelcomePage__section WelcomePage__hero">
        <div className="WelcomePage__hero-title">
          <img src="/favicon3.png" alt="Logo" width="20" />
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
      </section>
    </div>
  );
}

export default WelcomePage;
