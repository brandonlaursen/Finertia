import "./StockTransaction.css";
import { MdInfoOutline } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../store/session";
import { TiArrowUnsorted } from "react-icons/ti";
import { GrFormCheckmark } from "react-icons/gr";

function StockTransaction({ stock }) {
  const sessionUser = useSelector(selectUser);
  const [estimate, setEstimate] = useState(0);
  const [buyIn, setBuyIn] = useState("Dollars");
  const [buyInDropdown, setBuyInDropdown] = useState(false);

  const buyInRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (buyInRef.current && !buyInRef.current.contains(e.target)) {
        setBuyInDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="StockTransaction">
      <div className="StockTransaction__header">Buy {stock.symbol}</div>

      <div className="StockTransaction__body">
        <div className="StockTransaction__order-section">
          <div className="StockTransaction__order-section__text">
            <span>Order Type</span>
            <span className="StockTransaction__order-section__subtext">
              Limit <MdInfoOutline className="StockTransaction__info-icon" />
            </span>
          </div>

          <div className="StockTransaction__order-section__select">
            <div className="StockTransaction__order-section__container">
              <span>Buy Order</span>
            </div>
          </div>
        </div>

        <div className="StockTransaction__order-section">
          <div className="StockTransaction__order-section__text">
            <span>Buy in</span>
          </div>

          <div className="StockTransaction__order-section__select">
            <div
              className={`StockTransaction__order-section__container  ${
                buyInDropdown && "buyInDropDownBorder"
              }`}
              onClick={() => setBuyInDropdown(!buyInDropdown)}
              ref={buyInRef}
            >
              <span>{buyIn}</span>
              <TiArrowUnsorted />
            </div>
            {buyInDropdown && (
              <div className={`BuyInDropdown`}>
                <div className="BuyInDropdown-option">
                  <div className="checkmark-div">
                    {buyIn === "Dollars" && (
                      <GrFormCheckmark className="TransferModal__checkmark" />
                    )}
                  </div>

                  <span onClick={() => setBuyIn("Dollars")}>Dollars</span>
                </div>
                <div className="BuyInDropdown-option">
                  <div className="checkmark-div">
                    {buyIn === "Shares" && (
                      <GrFormCheckmark className="TransferModal__checkmark" />
                    )}
                  </div>

                  <span onClick={() => setBuyIn("Shares")}>Shares</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="StockTransaction__order-section">
          <div className="StockTransaction__order-section__text">
            <span>Amount</span>
          </div>

          <div className={`StockTransaction__input-wrapper`}>
            <span className="StockTransaction__dollar-sign">$</span>
            <input
              type="number"
              pattern="[0-9]*"
              className="StockTransaction__amount-input"
            />
          </div>
        </div>
        <div className="StockTransaction__line"></div>
      </div>

      <div className="StockTransaction__estimate">
        <span>Est.Quantity</span>
        <span className="StockTransaction__estimate-amount">
          {estimate.toFixed(2)}
        </span>
      </div>

      <div className="StockTransaction__button-container">
        <button className="StockTransaction__button">Review Order</button>
      </div>

      <div className="StockTransaction_footer">
        ${sessionUser.balance.toFixed(2)} buying power available
      </div>
    </div>
  );
}

export default StockTransaction;
