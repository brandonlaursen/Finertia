import "./WelcomePageFooter.css";
import { FiGithub } from "react-icons/fi";
import { FaLinkedinIn } from "react-icons/fa";
import { FaUserAstronaut } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";

function WelcomePageFooter() {
  return (
    <footer className="WelcomePageFooter">
      <section className="WelcomePageFooter__links">
        <a
          href="https://brandonlaursen.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="WelcomePageFooter__link"
        >
          <FaUserAstronaut />
        </a>

        <a
          href="https://www.linkedin.com/in/brandon-laursen/"
          target="_blank"
          rel="noopener noreferrer"
          className="WelcomePageFooter__link"
        >
          <FaLinkedinIn />
        </a>

        <a
          href="https://github.com/brandonlaursen"
          target="_blank"
          rel="noopener noreferrer"
          className="WelcomePageFooter__link"
        >
          <FiGithub />
        </a>

        <a
          href="https://github.com/brandonlaursen/Finertia"
          target="_blank"
          rel="noopener noreferrer"
          className="WelcomePageFooter__link"
        >
          <FaCode />
        </a>
      </section>
      <span className="WelcomePageFooter__name">© Brandon Laursen</span>
    </footer>
  );
}

export default WelcomePageFooter;
