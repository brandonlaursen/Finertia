import "./StockTrade.css";

import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import TradeType from "./TradeType";
import TradeAmount from "./TradeAmount/TradeAmount";
import TradeSummary from "./TradeSummary/TradeSummary";
import TradeReview from "./TradeReview/TradeReview";
import TradeHoldings from "./TradeHoldings/TradeHoldings";

import { selectUser } from "../../../../store/session";

import { fetchStockTransactions } from "../../../../store/transactions";

import handleStockTrade from "./helpers/handleStockTrade";

function StockTrade({ stock, setNotifications, setNotificationMessage }) {
  const dispatch = useDispatch();

  const sessionUser = useSelector(selectUser);

  console.log(stock)
  const stockSummary = sessionUser.stockSummary.stocksOwned[stock.symbol];

  const sharesOwned = stockSummary?.sharesOwned || 0;
  const { price } = stock;
  const { balance } = sessionUser.stockSummary;

  const [showReview, setShowReview] = useState(false);
  const [errors, setErrors] = useState(null);
  const [messages, setMessages] = useState(null);

  const [reviewingTrade, setReviewingTrade] = useState(false);

  // Buy or Sell
  const [tradeType, setTradeType] = useState("buy");

  // Dollars or Shares
  const [tradeUnit, setTradeUnit] = useState("Dollars");

  // The dollar amount a user wants to trade
  const [tradeAmount, setTradeAmount] = useState("");

  // The number of shares a user wants to trade
  const [sharesToTrade, setSharesToTrade] = useState("");

  // Estimated shares being traded
  const tradeSharesEstimate = useMemo(
    () => (tradeAmount / price).toFixed(5),
    [tradeAmount, price]
  );

  // Estimated cost of trade
  const tradeCostEstimate = useMemo(
    () => (sharesToTrade * price).toFixed(2),
    [sharesToTrade, price]
  );

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  function clearReview() {
    setShowReview(false);
    setErrors(null);
    setMessages(null);
    setReviewingTrade(false);
  }

  const stockTradeProps = {
    stock,
    balance,
    sharesOwned,
    price,
    tradeUnit,
    setTradeUnit,
    tradeType,
    setTradeType,
    tradeAmount,
    setTradeAmount,
    sharesToTrade,
    setSharesToTrade,
    tradeCostEstimate,
    tradeSharesEstimate,
    handleStockTrade,
    showReview,
    setShowReview,
    clearReview,
    errors,
    setErrors,
    messages,
    setMessages,
    setNotifications,
    setNotificationMessage,
    reviewingTrade,
    setReviewingTrade,
  };

  const tradeComponents = [
    TradeType,
    TradeAmount,
    TradeSummary,
    TradeReview,
    TradeHoldings,
  ];

  return (
    <div className="StockTrade">
      {tradeComponents.map((Component, index) => (
        <Component key={index} {...stockTradeProps} />
      ))}
    </div>
  );
}

export default StockTrade;
