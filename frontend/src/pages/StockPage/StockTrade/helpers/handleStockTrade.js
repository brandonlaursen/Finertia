async function handleStockTrade({
  stock,
  balance,
  sharesOwned,
  tradeUnit,
  tradeType,
  tradeAmount,
  sharesToTrade,
  tradeCostEstimate,
  tradeSharesEstimate,
  showReview,
  setShowReview,
  errors,
  setErrors,
  setMessage,
}) {
  setShowReview(!showReview);

  if (tradeType === "buy") {
    if (tradeUnit === "Dollars") {
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

    if (tradeUnit === "Shares") {
      if (Number(sharesToTrade).toFixed(5) < 0.000001) {
        setErrors([`Minimum Shares Amount`, `Enter at least 0.000001 shares`]);
        return;
      }
      if (tradeCostEstimate > balance) {
        setErrors([
          `Not Enough Buying Power`,
          `Edit your order or make a deposit in your individual account to continue.`,
        ]);
        return;
      }
    }
  }

  if (tradeType === "sell") {
    if (tradeUnit === "Dollars") {
      if (tradeAmount < 1) {
        setErrors([`Minimum Dollar Amount`, `Enter at least $1.00`]);
        return;
      }

      if (sharesOwned.toFixed(5) < Number(tradeSharesEstimate).toFixed(5)) {
        setErrors([`Not Enough Shares Available`, ``]);
        return;
      }
    }

    if (tradeUnit === "Shares") {
      if (Number(sharesToTrade).toFixed(5) < 0.000001) {
        setErrors([`Minimum Shares Amount`, `Enter at least 0.000001 shares`]);
        return;
      }
      if (sharesOwned.toFixed(5) < Number(sharesToTrade).toFixed(5)) {
        setErrors([`Not Enough Shares Available`, ``]);
        return;
      }
    }
  }

  if (!errors) {
    if (tradeType === "buy") {
      if (tradeUnit === "Shares") {
        setMessage(
          `You are placing a market order to buy ${Number(
            sharesToTrade
          ).toFixed(5)} shares of ${
            stock.name
          } at an estimated cost of $${tradeCostEstimate.toFixed(2)}`
        );
        return;
      }
      if (tradeUnit === "Dollars") {
        setMessage(
          `You are placing a market order to buy ${Number(
            tradeSharesEstimate
          ).toFixed(5)} shares of ${
            stock.name
          } at an estimated cost of $${tradeAmount.toFixed(2)}`
        );
        return;
      }
    }
    if (tradeType === "sell") {
      if (tradeUnit === "Shares") {
        setMessage(
          `You are selling ${Number(sharesToTrade).toFixed(
            5
          )} shares at the current market price. The estimated credit for this order is $${tradeCostEstimate.toFixed(
            2
          )}`
        );
        return;
      }
      if (tradeUnit === "Dollars") {
        setMessage(
          `You are selling ${Number(tradeSharesEstimate).toFixed(
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

export default handleStockTrade;
