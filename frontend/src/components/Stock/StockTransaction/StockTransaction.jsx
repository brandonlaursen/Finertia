import "./StockTransaction.css";
import { MdInfoOutline } from "react-icons/md";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../../../../store/session";
import { TiArrowUnsorted } from "react-icons/ti";
import { GrFormCheckmark } from "react-icons/gr";

import {
  fetchStockTransactions,
  executeStockTrade,
} from "../../../../store/transactions";

import { isValidTransaction } from "./helpers";

function StockTransaction({ stock }) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);
  const stockSummary = sessionUser.stockSummary[stock.symbol];
  const { sharesOwned } = stockSummary;

  console.log("stockSummary:", stockSummary);

  const buyInRef = useRef(null);

  // * The dollar amount a user wants to trade
  const [tradeAmount, setTradeAmount] = useState(0.0);

  // * The number of shares a user wants to trade
  const [sharesToTrade, setSharesToTrade] = useState(0);

  // * The estimated number of shares of the trade transaction
  const [estimatedShares, setEstimatedShares] = useState(0);

  // * The estimated cost of the trade trade transaction
  const [estimatedCost, setEstimatedCost] = useState(0);

  // * The type of buy in - Dollars or Shares
  const [buyIn, setBuyIn] = useState("Dollars");

  // * Toggle buy in drop down
  const [isBuyDropdownOpen, setIsBuyDropdownOpen] = useState(false);

  // * Type of transaction - buy or sell
  const [transactionType, setTransactionType] = useState("buy");

  const { price } = stock;
  const { balance } = sessionUser;

  // * get users transactions with current stock
  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  // * Update estimated amount of shares
  useEffect(() => {
    const estimatedAmountOfShares = tradeAmount.toFixed(2) / price.toFixed(2);
    setEstimatedShares(estimatedAmountOfShares.toFixed(2));
  }, [tradeAmount, price]);

  // * Update estimated amount in dollars
  useEffect(() => {
    const newEstimatedCost = sharesToTrade * price.toFixed(2);
    setEstimatedCost(newEstimatedCost);
  }, [sharesToTrade, price]);

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

  function handleTradeAmountChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    setTradeAmount(amount);
  }

  function handleTradeSharesChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    setSharesToTrade(amount);
  }

  async function handleStockTransaction() {
    // * Determine the number of shares based on buy-in type
    const numberOfShares =
      buyIn === "Dollars" ? estimatedShares : sharesToTrade;

    // * Check if this is a valid transaction
    if (tradeAmount === 0 || sharesToTrade === 0) return false;
    if (
      !isValidTransaction(
        balance,
        sharesOwned,
        price,
        transactionType,
        tradeAmount,
        estimatedCost
      )
    )
      return;

    const transaction = {
      stockId: stock.id,
      price,
      quantity: numberOfShares,
    };

    // * Execute trade
    await dispatch(
      executeStockTrade(transaction, transactionType, stock.symbol)
    );
  }

  // * Sell all shares of stock
  async function handleSellAll() {
    const transaction = {
      stockId: stock.id,
      price,
      quantity: sharesOwned,
    };

    await dispatch(executeStockTrade(transaction, transactionType));
  }

  return (
    <div className="StockTransaction">
      <div className="StockTransaction__header">
        <div
          className={`StockTransaction__header-buy  ${
            transactionType === "buy" && "StockTransaction__header-selected"
          }`}
          onClick={() => setTransactionType("buy")}
        >
          Buy {stock.symbol}
        </div>
        <div
          className={`StockTransaction__header-buy  ${
            transactionType === "sell" && "StockTransaction__header-selected"
          }`}
          onClick={() => setTransactionType("sell")}
        >
          Sell {stock.symbol}
        </div>
      </div>

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
              <span>
                {transactionType === "buy" ? "Buy Order" : "Sell Order"}
              </span>
            </div>
          </div>
        </div>

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
              <div className={`BuyInDropdown`}>
                <div
                  className={`BuyInDropdown-option ${
                    buyIn === "Dollars" && "BuyInDropdown-option-hover"
                  }`}
                >
                  <div className="checkmark-div">
                    {buyIn === "Dollars" && (
                      <GrFormCheckmark className="TransferModal__checkmark" />
                    )}
                  </div>

                  <span onClick={() => setBuyIn("Dollars")}>Dollars</span>
                </div>
                <div
                  className={`BuyInDropdown-option ${
                    buyIn === "Shares" && "BuyInDropdown-option-hover"
                  }`}
                >
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
          {buyIn === "Dollars" ? (
            <>
              <div className="StockTransaction__order-section__text">
                <span>Amount</span>
              </div>

              <div className={`StockTransaction__input-wrapper`}>
                <span className="StockTransaction__dollar-sign">$</span>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={tradeAmount}
                  placeholder="0.0"
                  className="StockTransaction__amount-input"
                  onChange={handleTradeAmountChange}
                />
              </div>
            </>
          ) : (
            <>
              <div className="StockTransaction__order-section__text">
                <span>Shares</span>
              </div>
              <div className={`StockTransaction__input-wrapper`}>
                <input
                  type="number"
                  pattern="[0-9]*"
                  value={sharesToTrade}
                  placeholder="0"
                  className="StockTransaction__amount-input"
                  onChange={handleTradeSharesChange}
                />
              </div>
            </>
          )}
        </div>
        {buyIn === "Shares" && (
          <div className="StockTransaction__market-price">
            <span className="StockTransaction__market-price-title">
              Market Price
            </span>
            <span>${price}</span>
          </div>
        )}
        <div className="StockTransaction__line"></div>
      </div>

      <div className="StockTransaction__estimate">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="StockTransaction__estimate-amount">
              {Number(estimatedShares).toFixed(2)}
            </span>
          </>
        ) : (
          <>
            <span>Estimated Cost</span>
            <span className="StockTransaction__estimate-amount">
              ${Number(estimatedCost).toFixed(2)}
            </span>
          </>
        )}
      </div>

      <div className="StockTransaction__button-container">
        <button
          className="StockTransaction__button"
          onClick={handleStockTransaction}
        >
          Review Order
        </button>
      </div>

      <div className="StockTransaction_footer">
        {transactionType === "buy" ? (
          ` $${balance.toFixed(2)} buying power available`
        ) : (
          <div className="StockTransaction_footer-sell">
            <span>{`$${(Number(sharesOwned) * price).toFixed(
              2
            )} Available`}</span>
            -
            <span
              className="StockTransaction_footer-text"
              onClick={handleSellAll}
            >
              Sell All
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default StockTransaction;
