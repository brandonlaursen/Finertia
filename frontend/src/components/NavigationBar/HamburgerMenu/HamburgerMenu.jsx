import "./HamburgerMenu.css";

import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  return (
    <div className="HamburgerMenu">
      {isMenuOpen ? (
        <IoClose
          className="hamburger-icon close-icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          onBlur={() => setIsMenuOpen(false)}
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
