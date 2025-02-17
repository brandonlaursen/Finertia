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

import {
  fetchStockTransactions,
  executeStockTrade,
} from "../../../../store/transactions";

function StockTransaction({ stock }) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);

  const stockSummary = sessionUser.stockSummary[stock.symbol];
  const sharesOwned = stockSummary?.sharesOwned || 0;
  const { price } = stock;
  const { balance } = sessionUser;

  const [showReview, setShowReview] = useState(false);
  const [errors, setErrors] = useState(null);

  // Type of transaction - buy or sell
  const [transactionType, setTransactionType] = useState("buy");
  // Type of buy in - Dollars or Shares
  const [buyIn, setBuyIn] = useState("Dollars");

  // The dollar amount a user wants to trade
  const [tradeAmount, setTradeAmount] = useState(0.0);
  // The number of shares a user wants to trade
  const [sharesToTrade, setSharesToTrade] = useState(0);

  // Estimated number of shares of trade transaction
  const [estimatedShares, setEstimatedShares] = useState(0);
  // Estimated cost of the trade transaction
  const [estimatedCost, setEstimatedCost] = useState(0);

  // get users transactions with current stock
  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  // Update estimated amount of shares
  useEffect(() => {
    const estimatedAmountOfShares = tradeAmount / price;
    setEstimatedShares(+estimatedAmountOfShares);
  }, [tradeAmount, price]);

  // Update estimated amount in dollars
  useEffect(() => {
    const newEstimatedCost = sharesToTrade * price;
    setEstimatedCost(newEstimatedCost);
  }, [sharesToTrade, price]);

  function handleTradeAmountChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    if (amount < 0) {
      console.log("Trade amount cannot be negative.");
      return;
    }
    setTradeAmount(amount);
    setSharesToTrade(0);
  }

  function handleTradeSharesChange(e) {
    const value = e.target.value;
    const amount = Number(value);
    if (amount < 0) {
      console.log("Trade amount cannot be negative.");
      return;
    }
    setSharesToTrade(amount);
    setTradeAmount(0);
  }

  const handleTransactionType = (type) => {
    setTransactionType(type);
    setSharesToTrade(0);
    setTradeAmount(0);
  };

  async function handleStockTransaction() {
    setShowReview(!showReview);

    // * Determine the number of shares based on buy-in type
    // const numberOfShares = buyIn === "Dollars" ? estimatedShares : sharesToTrade;

    if (balance <= 0 && transactionType === "buy") {
      console.log(`Insufficient balance. ${balance}`);
      setErrors(`Insufficient balance. ${balance}`);
      return;
    }

    if (sharesOwned <= 0 && transactionType === "sell") {
      console.log(`Insufficient shares ${sharesOwned}`);
      setErrors(`Insufficient shares ${sharesOwned}`);
      return;
    }

    if (
      (buyIn === "Dollars" && tradeAmount <= 0) ||
      (buyIn === "Shares" && sharesToTrade <= 0)
    ) {
      console.log(`Minimum Dollar Amount`);
      setErrors(`Minimum Dollar Amount`);
      return false;
    }

    if (isNaN(tradeAmount) || tradeAmount < 0) {
      console.log(`Minimum Dollar Amount`);
      setErrors(`Minimum Dollar Amount`);
      return;
    }

    if (isNaN(sharesToTrade) || sharesToTrade < 0) {
      console.log(`Minimum Shares Amount`);
      setErrors(`Minimum Dollar Amount`);
      return;
    }

    if (transactionType === "buy") {
      console.log(
        `ATTEMPTING TO BUY ${tradeAmount} or ${estimatedCost} with ${balance}`
      );
      if (tradeAmount > balance) {
        console.log(
          `TRADE AMOUNT - ${tradeAmount} EXCEEDS BALANCE - ${balance}`
        );

        setErrors(`Trade Amount - ${tradeAmount} Exceeds Balance - ${balance}`);
        return;
      }
      if (estimatedCost > balance) {
        console.log(
          `ESTIMATED COST - ${estimatedCost} EXCEEDS BALANCE - ${balance}`
        );

        setErrors(
          `Estimated Cost - ${estimatedCost} Exceeds Balance - ${balance}`
        );
        return;
      }
    }
    if (transactionType === "sell") {
      console.log(
        `ATTEMPTING TO SELL ${estimatedShares} or ${sharesToTrade} with ${sharesOwned}`
      );

      if (estimatedShares < 0 || sharesToTrade < 0) {
        console.log(`Minimum Shares Amount`);

        setErrors(`Minimum Shares Amount`);
        return;
      }

      if (estimatedShares > sharesOwned) {
        console.log(
          `ESTIMATED SHARES - ${estimatedShares} EXCEEDS SHARES OWNED  - ${sharesOwned}`
        );

        setErrors(
          `Estimated Shares - ${estimatedShares} Exceeds Shares Owned  - ${sharesOwned}`
        );
        return;
      }
      if (sharesToTrade > sharesOwned) {
        console.log(
          `SHARES AMOUNT - ${sharesToTrade} EXCEEDS OWNED - ${sharesOwned}`
        );

        setErrors(
          `Estimated Shares - ${estimatedShares} Exceeds Shares Owned  - ${sharesOwned}`
        );
        return;
      }
      if (sharesOwned * price < estimatedCost) {
        console.log(
          `ESTIMATED COST - ${estimatedCost} EXCEEDS BALANCE - ${
            sharesOwned * price
          }`
        );

        setErrors(
          `Estimated Cost - ${estimatedCost} Exceeds Balance - ${balance}`
        );
        return;
      }
    }

    // const transaction = {
    //   stockId: stock.id,
    //   price,
    //   quantity: numberOfShares,
    // };

    // * Execute trade
    // await dispatch(
    //   executeStockTrade(transaction, transactionType, stock.symbol)
    // );
  }

  async function handleSellAll() {
    if (sharesOwned <= 0) {
      console.log(`NO SHARES TO SELL ${sharesOwned}`);
      return;
    }
    const transaction = {
      stockId: stock.id,
      price,
      quantity: sharesOwned,
    };

    await dispatch(executeStockTrade(transaction, transactionType));
  }

  return (
    <div className="StockTransaction">
      <StockTransactionHeader
        stock={stock}
        transactionType={transactionType}
        handleTransactionType={handleTransactionType}
      />

      <div className="StockTransaction__body">
        <OrderType transactionType={transactionType} />

        <BuyIn
          transactionType={transactionType}
          buyIn={buyIn}
          setBuyIn={setBuyIn}
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
