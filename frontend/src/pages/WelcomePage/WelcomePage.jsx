import "./WelcomePage.css";
import { LuInfo } from "react-icons/lu";
import { FaSpaceShuttle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaUserAstronaut } from "react-icons/fa6";

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
          <FaSpaceShuttle />
          <span>Finertia Investing</span>
        </div>

        <div className="WelcomePage__hero-highlight">
          <h1>
            Investing, like space, requires momentum—stay the course, &quot;defy
            inertia.&quot;
          </h1>
          {sessionUser ? null : (
            <Link to="/signup">
              <button className="WelcomePage__hero-button">Get Started</button>
            </Link>
          )}
        </div>
      </section>

      {/* <section className="WelcomePage__section WelcomePage__features">
        <figure className="WelcomePage__features-image" />

        <div className="WelcomePage__features-contents">
          <header className="WelcomePage__features-contents__header">
            Investing
          </header>
          <sub className="WelcomePage__features-contents__sub-header">
            Build your portfolio starting with just $1
          </sub>
          <text className="WelcomePage__features-contents__text">
            Invest in stocks, at your pace and commission-free
          </text>
          <small className="WelcomePage__features-contents__disclosure">
            <LuInfo className="WelcomePage__features-contents__info-icon" />
            Investing Disclosures
          </small>
          <button className="WelcomePage__features-content__button">
            Learn More
          </button>
        </div>
      </section>

      <section className="WelcomePage__join WelcomePage__section ">
        <figure className="WelcomePage__join__image" />
        <header className="WelcomePage__join__header">
          Join a new generation of investors.
        </header>
        <button className="WelcomePage__join__button">Sign up</button>
      </section> */}

      <footer className="WelcomePage__footer">
        <div className="footer-content">
          <p className="footer-content">
            <FaUserAstronaut />
            Brandon Laursen
          </p>
          |
          <a
            href="https://www.linkedin.com/in/brandon-laursen-398563218/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-content"
          >
            <FaLinkedin />
            LinkedIn
          </a>
          |
          <a
            href="https://github.com/brandonlaursen"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-content"
          >
            <FaGithub />
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

export default WelcomePage;
