// Helper function to update stock holdings
const updateStockHoldings = (
  stocksHoldings,
  stockSymbol,
  quantity,
  transactionType,
) => {
  if (transactionType === "buy") {
    if (!stocksHoldings[stockSymbol]) {
      stocksHoldings[stockSymbol] = quantity;
    } else {
      const currentQuantity = stocksHoldings[stockSymbol];
      const updatedQuantity =
        Math.round((currentQuantity + quantity) * 100000) / 100000;

      stocksHoldings[stockSymbol] = updatedQuantity;
    }
  } else {
    if (!stocksHoldings[stockSymbol]) {
      stocksHoldings[stockSymbol] = quantity;
    } else {
      const currentQuantity = stocksHoldings[stockSymbol];
      const updatedQuantity =
        Math.round((currentQuantity - quantity) * 100000) / 100000;
      stocksHoldings[stockSymbol] = updatedQuantity;
    }
  }
};

module.exports = updateStockHoldings;
