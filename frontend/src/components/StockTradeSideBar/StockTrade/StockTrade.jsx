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

  let sharesOwned = 0;

  if (
    sessionUser?.stockSummary?.stocksOwned &&
    stock?.symbol &&
    sessionUser.stockSummary.stocksOwned[stock.symbol]
  ) {
    const stockSummary = sessionUser.stockSummary.stocksOwned[stock.symbol];
    sharesOwned = stockSummary.sharesOwned ?? 0;
  }

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

  const tradeSharesEstimate = useMemo(() => {
    if (!Number.isFinite(price) || price === 0) return "0.00000";
    return (tradeAmount / price).toFixed(5);
  }, [tradeAmount, price]);

  // Estimated cost of trade
  const tradeCostEstimate = useMemo(() => {
    if (!Number.isFinite(price)) return "0.00";
    return (sharesToTrade * price).toFixed(2);
  }, [sharesToTrade, price]);

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
