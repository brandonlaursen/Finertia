import "./BuyIn.css";
import { TiArrowUnsorted } from "react-icons/ti";

import { useState, useRef, useEffect } from "react";

import BuyInDropdown from "../BuyInDropdown/BuyInDropdown";

function BuyIn({ transactionType, setBuyIn, buyIn }) {
  const buyInRef = useRef(null);

  // * Toggle buy in drop down
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);

  // * handle dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buyInRef.current && !buyInRef.current.contains(e.target)) {
        setIsBuyDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="StockTransaction__order-section">
      <div className="StockTransaction__order-section__text">
        <span>{transactionType === "buy" ? "Buy In" : "Sell In"}</span>
      </div>

      <div className="StockTransaction__order-section__select">
        <div
          className={`StockTransaction__order-section__container  ${
            isBuyDropdownOpen && "buyInDropDownBorder"
          }`}
          onClick={() => setIsBuyDropdownOpen(!isBuyDropdownOpen)}
          ref={buyInRef}
        >
          <span>{buyIn}</span>
          <TiArrowUnsorted />
        </div>
        {isBuyDropdownOpen && (
          <BuyInDropdown buyIn={buyIn} setBuyIn={setBuyIn} />
        )}
      </div>
    </div>
  );
}

export default BuyIn;
