import "./StockTransaction.css";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import StockTransactionHeader from "./StockTransactionHeader";
import BuyIn from "./BuyIn";
import OrderType from "./OrderType/OrderType";
import StockTransactionOrder from "./StockTransactionOrder";
import StockTradeEstimate from "./StockTradeEstimate/StockTradeEstimate";
import StockTransactionFooter from "./StockTransactionFooter/StockTransactionFooter";

import { selectUser } from "../../../../store/session";

import { fetchStockTransactions } from "../../../../store/transactions";

function StockTransaction({ stock, setNotifications, setNotificationMessage  }) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);

  const stockSummary = sessionUser.stockSummary[stock.symbol];
  const sharesOwned = stockSummary?.sharesOwned || 0;
  const { price } = stock;
  const { balance } = sessionUser;

  const [showReview, setShowReview] = useState(false);
  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);




  // Type of transaction - buy or sell
  const [transactionType, setTransactionType] = useState("buy");
  // Type of buy in - Dollars or Shares
  const [buyIn, setBuyIn] = useState("Dollars");

  // The dollar amount a user wants to trade
  const [tradeAmount, setTradeAmount] = useState("");
  // The number of shares a user wants to trade
  const [sharesToTrade, setSharesToTrade] = useState("");

  // Estimated number of shares of trade transaction
  const [estimatedShares, setEstimatedShares] = useState("");
  // Estimated cost of the trade transaction
  const [estimatedCost, setEstimatedCost] = useState("");

  // get users transactions with current stock
  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  // Update estimated amount of shares
  useEffect(() => {
    const estimatedAmountOfShares = tradeAmount / price;

    setEstimatedShares(Number(estimatedAmountOfShares).toFixed(5));
  }, [tradeAmount, price]);

  // Update estimated amount in dollars
  useEffect(() => {
    const newEstimatedCost = Number(sharesToTrade).toFixed(5) * price;
    setEstimatedCost(newEstimatedCost);
  }, [sharesToTrade, price]);

  function handleTradeAmountChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    clearReview();
    setTradeAmount(amount);
    setSharesToTrade('');
  }

  function handleTradeSharesChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    clearReview();
    setSharesToTrade(amount);
    setTradeAmount('');
  }

  const handleTransactionType = (type) => {
    setTransactionType(type);
    setSharesToTrade('');
    setTradeAmount('');
  };

  async function handleStockTransaction() {
    setShowReview(!showReview);

    // * Determine the number of shares based on buy-in type
    // const numberOfShares = buyIn === "Dollars" ? estimatedShares : sharesToTrade;

    if (transactionType === "buy") {
      if (buyIn === "Dollars") {
        if (tradeAmount < 1) {
          setErrors([`Minimum Dollar Amount`, `Enter at least $1.00`]);
          return;
        }
        if (tradeAmount > balance) {
          setErrors([
            `Not Enough Buying Power`,
            `Edit your order or make a deposit in your individual account to continue.`,
          ]);
          return;
        }
      }

      if (buyIn === "Shares") {
        if (Number(sharesToTrade).toFixed(5) < 0.000001) {
          setErrors([
            `Minimum Shares Amount`,
            `Enter at least 0.000001 shares`,
          ]);
          return;
        }
        if (estimatedCost > balance) {
          setErrors([
            `Not Enough Buying Power`,
            `Edit your order or make a deposit in your individual account to continue.`,
          ]);
          return;
        }
      }
    }

    if (transactionType === "sell") {
      if (buyIn === "Dollars") {
        if (tradeAmount < 1) {
          setErrors([`Minimum Dollar Amount`, `Enter at least $1.00`]);
          return;
        }

        if (sharesOwned.toFixed(5) < Number(estimatedShares).toFixed(5)) {
          setErrors([`Not Enough Shares Available`, ``]);
          return;
        }
      }

      if (buyIn === "Shares") {
        if (Number(sharesToTrade).toFixed(5) < 0.000001) {
          setErrors([
            `Not Enough Shares Available`,
            `Enter at least 0.000001 shares`,
          ]);
          return;
        }
        if (sharesOwned.toFixed(5) < Number(sharesToTrade).toFixed(5)) {
          setErrors([`Not Enough Shares Available`, ``]);
          return;
        }
      }
    }

    if (!errors) {
      if (transactionType === "buy") {
        if (buyIn === "Shares") {
          setMessage(
            `You are placing a market order to buy ${Number(
              sharesToTrade
            ).toFixed(5)} shares of ${
              stock.name
            } at an estimated cost of $${estimatedCost.toFixed(2)}`
          );
          return;
        }
        if (buyIn === "Dollars") {
          setMessage(
            `You are placing a market order to buy ${Number(
              estimatedShares
            ).toFixed(5)} shares of ${
              stock.name
            } at an estimated cost of $${tradeAmount.toFixed(2)}`
          );
          return;
        }
      }
      if (transactionType === "sell") {
        if (buyIn === "Shares") {
          setMessage(
            `You are selling ${Number(sharesToTrade).toFixed(
              5
            )} shares at the current market price. The estimated credit for this order is $${estimatedCost.toFixed(
              2
            )}`
          );
          return;
        }
        if (buyIn === "Dollars") {
          setMessage(
            `You are selling ${Number(estimatedShares).toFixed(
              5
            )} shares at the current market price. The estimated credit for this order is $${tradeAmount.toFixed(
              2
            )}`
          );
          return;
        }
      }
    }
  }

  async function handleSellAll() {
    setTransactionType("sell");
    setBuyIn("Shares");
    setSharesToTrade(Number(sharesOwned).toFixed(5));
  }

  function clearReview() {
    setShowReview(false);
    setErrors(null);
    setMessage(null);
  }

  return (
    <div className="StockTransaction">
      <StockTransactionHeader
        stock={stock}
        transactionType={transactionType}
        handleTransactionType={handleTransactionType}
        clearReview={clearReview}
      />

      <div className="StockTransaction__body">
        <OrderType transactionType={transactionType} />

        <BuyIn
          transactionType={transactionType}
          buyIn={buyIn}
          setBuyIn={setBuyIn}
          clearReview={clearReview}
        />

        <StockTransactionOrder
          price={price}
          buyIn={buyIn}
          tradeAmount={tradeAmount}
          handleTradeAmountChange={handleTradeAmountChange}
          sharesToTrade={sharesToTrade}
          handleTradeSharesChange={handleTradeSharesChange}
        />
      </div>

      <StockTradeEstimate
        buyIn={buyIn}
        estimatedShares={estimatedShares}
        transactionType={transactionType}
        estimatedCost={estimatedCost}
        showReview={showReview}
        setShowReview={setShowReview}
        errors={errors}
        setErrors={setErrors}
        handleStockTransaction={handleStockTransaction}
        message={message}
        setMessage={setMessage}
        clearReview={clearReview}
        price={price}
        stock={stock}
        sharesToTrade={sharesToTrade}
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
        setSharesToTrade={setSharesToTrade}
        setTradeAmount={setTradeAmount}
      />

      <StockTransactionFooter
        transactionType={transactionType}
        balance={balance}
        buyIn={buyIn}
        sharesOwned={sharesOwned}
        price={price}
        handleSellAll={handleSellAll}
      />


    </div>
  );
}

export default StockTransaction;
