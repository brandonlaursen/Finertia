import "./MobileTopBar.css";
import { MdOutlineArrowBackIos } from "react-icons/md";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import HamburgerMenu from "../NavigationBar/HamburgerMenu";
import HamburgerDropdown from "../NavigationBar/HamburgerDropdown";

function MobileTopBar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="MobileTopBar">
      <div className="MobileTopBar__back">
        <MdOutlineArrowBackIos
          className="MobileTopBar__back-button"
          onClick={goBack}
        />
      </div>

      <div ref={menuRef} className="HamburgerMenu__wrapper">
        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        {isMenuOpen && (
          <HamburgerDropdown
            navigate={navigate}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}
      </div>
    </div>
  );
}

export default MobileTopBar;
