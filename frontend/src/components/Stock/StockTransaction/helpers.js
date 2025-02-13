function validateBuyTransaction(balance, tradeAmount, estimatedCost) {
  return tradeAmount <= balance && estimatedCost <= balance;
}

function validateSellTransaction(
  userOwnedShares,
  price,
  tradeAmount,
  estimatedCost
) {
  const priceOfTransaction = userOwnedShares * price;
  return (
    tradeAmount <= priceOfTransaction && estimatedCost <= priceOfTransaction
  );
}

export function isValidTransaction(
  balance,
  userOwnedShares,
  price,
  transactionType,
  tradeAmount,
  estimatedCost
) {
  if (transactionType === "buy") {
    return validateBuyTransaction(balance, tradeAmount, estimatedCost);
  }

  if (transactionType === "sell") {
    return validateSellTransaction(
      userOwnedShares,
      price,
      tradeAmount,
      estimatedCost
    );
  }

  return false;
}

export function calculateOwnedShares(stockTransactions) {
  return stockTransactions.reduce((total, { transactionType, quantity }) => {
    return transactionType === "buy"
      ? total + quantity
      : transactionType === "sell"
      ? total - quantity
      : total;
  }, 0);
}
