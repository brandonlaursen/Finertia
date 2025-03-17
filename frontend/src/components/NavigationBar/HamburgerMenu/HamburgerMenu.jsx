import "./HamburgerMenu.css";

import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseLargeFill } from "react-icons/ri";

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <div className="HamburgerMenu">
      {isMenuOpen ? (
        <RiCloseLargeFill
          className="close-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}

        />
      ) : (
        <GiHamburgerMenu
          className="hamburger-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      )}
    </div>
  );
}
export default HamburgerMenu;
