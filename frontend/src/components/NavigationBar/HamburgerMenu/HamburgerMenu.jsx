import "./HamburgerMenu.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeFill } from "react-icons/ri";

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <div className="HamburgerMenu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
      <GiHamburgerMenu
        className={`hamburger-icon ${isMenuOpen ? "fade-out" : "fade-in"}`}
      />
      <RiCloseLargeFill
        className={`close-icon ${isMenuOpen ? "fade-in" : "fade-out"}`}
      />
    </div>
  );
}

export default HamburgerMenu;
