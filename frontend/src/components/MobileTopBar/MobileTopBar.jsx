import "./MobileTopBar.css";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";

import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import HamburgerMenu from "../NavigationBar/HamburgerMenu";
import HamburgerDropdown from "../NavigationBar/HamburgerDropdown";

function MobileTopBar() {
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const location = useLocation();

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
        {/* <div className="MobileTopBar__add-to-list">
          {location.pathname.includes("stocks/") && (
            <IoMdAddCircle className="MobileTopBar__add-to-list-btn " />
          )}
        </div> */}
        <HamburgerMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        {isMenuOpen && <HamburgerDropdown navigate={navigate} />}
      </div>
    </div>
  );
}

export default MobileTopBar;
