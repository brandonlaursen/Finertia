import "./WelcomePage.css";
import { LuInfo } from "react-icons/lu";
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
          <span>Finertia Investing</span>
        </div>

        <div className="WelcomePage__section-one__highlight">
          <h1>
            Investing, like space, requires momentum—stay the course, &quot;defy
            inertia.&quot;
          </h1>
          {sessionUser ? null : (
            <Link to="/signup">
              <button className="WelcomePage__section-one__button">Get Started</button>
            </Link>
          )}
        </div>
      </div>

      <div className="WelcomePage__section-two">
          <div className="WelcomePage__section-two__image-container">

          </div>
          <div className="WelcomePage__section-two__text-container">
              <div className="WelcomePage__header">Investing</div>
              <div className="WelcomePage__sub-header">Build your portfolio starting with just $1</div>
              <div className="WelcomePage__text">Invest in stocks, at your pace and commission-free</div>
              <div className="WelcomePage__disclosure"> <LuInfo className="WelcomePage__info-icon"/>Investing Disclosures</div>
              <button className="WelcomePage__learn-more__button">Learn More</button>
          </div>


      </div>

      <div className="WelcomePage__section-three">
        <div className="WelcomePage__section-three__image"></div>
        <span className="WelcomePage__section-three__text">Join a new generation of investors.</span>
        <button className="WelcomePage__section-three__button">Sign up</button>
      </div>

      <div className="WelcomePage__footer">Brandon Laursen</div>
    </div>
  );
}

export default WelcomePage;
