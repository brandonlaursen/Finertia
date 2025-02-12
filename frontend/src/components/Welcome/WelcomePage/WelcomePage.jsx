import "./WelcomePage.css";

import { FaSpaceShuttle } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import WelcomePageNavbar from "../WelcomePageNavbar";

import { selectUser } from "../../../../store/session";

function WelcomePage() {
  const sessionUser = useSelector(selectUser);

  return (
    <div className="WelcomePage">
      <WelcomePageNavbar />

      <div className="WelcomePage__section-one">
        <div className="WelcomePage__section-one__title">
          <FaSpaceShuttle />
          <h2>Finertia Investing</h2>
        </div>

        <div className="WelcomePage__section-one__highlight">
          <h1>
            Investing, like space, requires momentum—stay the course, &quot;defy
            inertia.&quot;
          </h1>
          {sessionUser ? null : (
            <Link to="/signup">
              <button id="WelcomePage__section-one__button">Get Started</button>
            </Link>
          )}
        </div>
      </div>

      <div className="WelcomePage__section-two">Section 2</div>

      <div className="WelcomePage__section-three">Section 3</div>

      <div className="WelcomePage__footer">Footer</div>
    </div>
  );
}

export default WelcomePage;
