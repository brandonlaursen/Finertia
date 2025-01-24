import "./WelcomePage.css";
import { FaSpaceShuttle } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import WelcomePageNav from "./WelcomePageNav";

import { selectUser } from "../../../store/session";


function WelcomePage() {
  const sessionUser = useSelector(selectUser);

  return (
    <div className="welcome-page-container">
      <WelcomePageNav />

      <div className="welcome-page-1">
        <div className="welcome-page-1-section-1">
          <FaSpaceShuttle />
          <h2>Finertia Investing</h2>
        </div>

        <div className="welcome-page-1-section-2">
          <h1>
            Investing, like space, requires momentum—stay the course, &quot;defy
            inertia.&quot;
          </h1>
          {sessionUser ? null : (
            <Link to="/signup">
              <button id="get-started">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className="welcome-page-2">Section 2</div>
      <div className="welcome-page-3">Section 3</div>
      <div className="welcome-page-footer">Footer</div>
    </div>
  );
}

export default WelcomePage;
