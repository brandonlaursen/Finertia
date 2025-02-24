
// Utility: Get the union of timestamps from both datasets, then sort them
function getUnionTimestamps(transactions, prices) {
  const tsSet = new Set([
    ...Object.keys(transactions),
    ...Object.keys(prices)
  ]);
  // Convert to numbers and sort ascending
  return Array.from(tsSet).map(Number).sort((a, b) => a - b);
}

// Since we'll be iterating in order, we can carry forward the last known historical snapshot
let lastHistoricalSnapshot = null;

// Main function to combine both timelines
function mergeTransactionAndAggregateData(processedTransactions, historicalPrices) {
  const unionTimestamps = getUnionTimestamps(processedTransactions, historicalPrices);

  // Initialize current portfolio state.
  // Before any transaction, we assume balance 0 and empty stock holdings.
  let currentBalance = 0;
  let currentStockSharesOwned = {};

  const result = {};

  unionTimestamps.forEach(ts => {
    const tsStr = ts.toString();

    // Update portfolio state if there's a transaction at this timestamp.

    if (processedTransactions[tsStr]) {
      const transaction = processedTransactions[tsStr];

      currentBalance = transaction.balance;
      // Overwrite with the snapshot of shares owned from the transaction.
      currentStockSharesOwned = { ...transaction.stockSharesOwned };

    }

    // Update the historical price snapshot if available at this timestamp.
    // If not, lastHistoricalSnapshot remains the most recent snapshot.
    if (historicalPrices[tsStr]) {
      lastHistoricalSnapshot = historicalPrices[tsStr];
    }

    // Build the stocksOwned object using the last known historical snapshot (if any)
    let stocksOwned = {};
    let totalInvestments = 0;

    if (lastHistoricalSnapshot) {

      for (const [stock, shares] of Object.entries(currentStockSharesOwned)) {
      
        if (shares.quantity > 0 && lastHistoricalSnapshot[stock]) {
          const price = lastHistoricalSnapshot[stock].price;
          stocksOwned[stock] = { price, sharesOwned: shares.quantity, symbol: stock, purchasePrice: shares.purchasePrice, stockName: shares.stockName, stockId: shares.stockId  };
          const stockTotal = Math.round((price * shares.quantity) * 100) / 100;
          const newTotalInvestments = Math.round((totalInvestments + stockTotal) * 100) / 100;
          totalInvestments = newTotalInvestments;
        }
      }
    }

    result[tsStr] = {
      timestamp: ts,
      balance: currentBalance,
      stocksOwned,
      totalInvestments
    };
  });


  return result;
}




module.exports = mergeTransactionAndAggregateData;
