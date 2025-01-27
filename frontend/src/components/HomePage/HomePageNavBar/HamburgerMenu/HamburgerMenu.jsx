import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

function HamburgerMenu({ isMenuOpen, setIsMenuOpen }) {
  const toggleHamburgerMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="hamburger-icon-container">
      {isMenuOpen ? (
        <IoClose
          className="hamburger-icon close-icon"
          onClick={toggleHamburgerMenu}
          onBlur={() => setIsMenuOpen(false)}
        />
      ) : (
        <GiHamburgerMenu
          className="hamburger-icon"
          onClick={toggleHamburgerMenu}
        />
      )}
    </div>
  );
}
export default HamburgerMenu;
