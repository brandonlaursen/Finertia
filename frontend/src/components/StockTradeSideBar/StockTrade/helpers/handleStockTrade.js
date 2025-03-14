async function handleStockTrade({
  stock,
  balance,
  tradeUnit,
  tradeType,
  sharesOwned,
  sharesToTrade,
  tradeAmount,
  tradeSharesEstimate,
  tradeCostEstimate,
  showReview,
  setShowReview,
  errors,
  setErrors,
  setMessages,
}) {
  setShowReview(!showReview);

  // Convert all numeric values to numbers and handle precision consistently
  const MIN_SHARES = 0.000001;
  const MIN_DOLLARS = 1;
  const sharesOwnedNum = Number(sharesOwned);
  const sharesToTradeNum = Number(sharesToTrade);
  const tradeAmountNum = Number(tradeAmount);
  const tradeSharesEstimateNum = Number(tradeSharesEstimate);
  const tradeCostEstimateNum = Number(tradeCostEstimate);
console.log(tradeAmountNum > balance)
  if (tradeType === "buy") {
    if (tradeUnit === "Dollars") {
      if (tradeAmountNum < MIN_DOLLARS) {
        setErrors([`Minimum Dollar Amount.`, `Enter at least $1.00.`]);
        return;
      }
      if (tradeAmountNum > balance) {
        setErrors([
          `Not Enough Buying Power.`,
          `Edit your order or make a deposit in your individual account to continue.`,
        ]);
        return;
      }
    }

    if (tradeUnit === "Shares") {
      if (sharesToTradeNum < MIN_SHARES) {
        setErrors([`Not enough shares.`, `Enter at least 0.000001 shares.`]);
        return;
      }
      if (tradeCostEstimate > balance) {
        setErrors([
          `Not Enough Buying Power.`,
          `Edit your order or make a deposit in your individual account to continue.`,
        ]);
        return;
      }
    }
  }

  if (tradeType === "sell") {
    if (tradeUnit === "Dollars") {
      if (tradeAmountNum < MIN_DOLLARS) {
        setErrors([`Minimum Dollar Amount.`, `Enter at least $1.00.`]);
        return;
      }

      if (sharesOwnedNum < tradeSharesEstimateNum) {
        setErrors([`Not Enough Shares Available.`, ``]);
        return;
      }
    }

    if (tradeUnit === "Shares") {
      if (sharesToTradeNum < MIN_SHARES) {
        setErrors([`Not enough shares.`, `Enter at least 0.000001 shares.`]);
        return;
      }
      if (sharesOwnedNum < sharesToTradeNum) {
        setErrors([`Not Enough Shares Available.`, ``]);
        return;
      }
    }
  }

  if (!errors) {
    if (tradeType === "buy") {
      if (tradeUnit === "Shares") {
        setMessages([
          "Your order will be placed.",
          `You are placing a market order to buy ${sharesToTradeNum.toFixed(
            5
          )} shares of ${
            stock.name
          } at an estimated cost of $${tradeCostEstimateNum.toFixed(2)}.`,
        ]);
        return;
      }
      if (tradeUnit === "Dollars") {
        setMessages([
          "Your order will be placed.",
          `You are placing a market order to buy ${tradeSharesEstimateNum.toFixed(
            5
          )} shares of ${
            stock.name
          } at an estimated cost of $${tradeAmountNum.toFixed(2)}.`,
        ]);
        return;
      }
    }
    if (tradeType === "sell") {
      if (tradeUnit === "Shares") {
        setMessages([
          "Your order will be placed.",
          `You are selling ${sharesToTradeNum.toFixed(
            5
          )} shares at the current market price. The estimated credit for this order is $${tradeCostEstimateNum.toFixed(
            2
          )}.`,
        ]);
        return;
      }
      if (tradeUnit === "Dollars") {
        setMessages([
          "Your order will be placed.",
          `You are selling ${tradeSharesEstimateNum.toFixed(
            5
          )} shares at the current market price. The estimated credit for this order is $${tradeAmountNum.toFixed(
            2
          )}.`,
        ]);
        return;
      }
    }
  }
}

export default handleStockTrade;
