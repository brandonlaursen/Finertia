import "./TradeAmount.css";
import { MdInfoOutline } from "react-icons/md";
import { TiArrowUnsorted } from "react-icons/ti";

import { useState, useRef, useEffect } from "react";

import TradeAmountTypeDropdown from "../TradeAmountDropdown";

function TradeAmount({
  transactionType,
  setBuyIn,
  buyIn,
  clearReview,
  tradeAmount,
  handleTradeAmountChange,
  sharesToTrade,
  handleTradeSharesChange,
  price,
}) {
  const buyInRef = useRef(null);

  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);

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
    <div className="TradeAmount">
      <section className="TradeAmount__section">
        <header className="TradeAmount__header">
          <span>Order Type</span>
          <span className="TradeAmount__subtext">
            Limit <MdInfoOutline className="TradeAmount__info-icon" />
          </span>
        </header>

        <div className="TradeAmount__option">
          <div className="TradeAmount__select">
            <span>
              {transactionType === "buy" ? "Buy Order" : "Sell Order"}
            </span>
          </div>
        </div>
      </section>

      <section className="TradeAmount__section">
        <header className="TradeAmount__header">
          <span>{transactionType === "buy" ? "Buy In" : "Sell In"}</span>
        </header>

        <div className="TradeAmount__option">
          <div
            className={`TradeAmount__select  ${
              isBuyDropdownOpen && "buyInDropDownBorder"
            }`}
            onClick={() => {
              setIsBuyDropdownOpen(!isBuyDropdownOpen);
            }}
            ref={buyInRef}
          >
            <span>{buyIn}</span>
            <TiArrowUnsorted />
          </div>
          {isBuyDropdownOpen && (
            <TradeAmountTypeDropdown
              buyIn={buyIn}
              setBuyIn={setBuyIn}
              clearReview={clearReview}
            />
          )}
        </div>
      </section>

      <section className="TradeAmount__section">
        {buyIn === "Dollars" ? (
          <>
            <header className="TradeAmount__header">
              <span>Amount</span>
            </header>

            <div className="TradeAmount__input-container">
              <span className="TradeAmount__dollar-sign">$</span>
              <input
                type="number"
                pattern="[0-9]*"
                value={tradeAmount || ""}
                placeholder="0.0"
                className="TradeAmount__input"
                onChange={handleTradeAmountChange}
              />
            </div>
          </>
        ) : (
          <>
            <header className="TradeAmount__header">
              <span>Shares</span>
            </header>
            <div className="TradeAmount__input-container">
              <input
                type="number"
                pattern="[0-9]*"
                value={sharesToTrade || ""}
                placeholder="0"
                className="TradeAmount__input"
                onChange={handleTradeSharesChange}
              />
            </div>
          </>
        )}
      </section>

      {buyIn === "Shares" && (
        <div className="TradeAmount__amount">
          <span className="TradeAmount__amount-title">Market Price</span>
          <span>${price.toFixed(2)}</span>
        </div>
      )}
      <div className="StockTransaction__line" />
    </div>
  );
}

export default TradeAmount;
