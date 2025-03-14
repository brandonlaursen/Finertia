// Helper function to update stock holdings
const updateStockHoldings = (
  stocksHoldings,
  stockSymbol,
  quantity,
  transactionType,
  stockId,
  purchasePrice,
  stockName
) => {
  if (transactionType === "buy") {
    if (!stocksHoldings[stockSymbol]) {
      stocksHoldings[stockSymbol] = {
        quantity,
        stockId,
        purchasePrice,
        stockName,
      };

      // stocksHoldings[stockSymbol] = {quantity}
    } else {
      const currentQuantity = stocksHoldings[stockSymbol].quantity;
      const updatedQuantity =
        Math.round((currentQuantity + quantity) * 100000) / 100000;
        stocksHoldings[stockSymbol].quantity = updatedQuantity;
      // stocksHoldings[stockSymbol] = updatedQuantity;
    }
  } else {
    if (!stocksHoldings[stockSymbol]) {
      stocksHoldings[stockSymbol].quantity = quantity;
    } else {
      const currentQuantity = stocksHoldings[stockSymbol].quantity;
      const updatedQuantity =
        Math.round((currentQuantity - quantity) * 100000) / 100000;
      stocksHoldings[stockSymbol].quantity = updatedQuantity;
    }
  }
  
};

module.exports = updateStockHoldings;
