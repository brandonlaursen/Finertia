// Utility: Deep clone an object (for simple objects)
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Utility: Get the union of timestamps from both datasets, then sort ascending.
function getUnionTimestamps(transactions, prices) {
  const tsSet = new Set([...Object.keys(transactions), ...Object.keys(prices)]);
  return Array.from(tsSet)
    .map(Number)
    .sort((a, b) => a - b);
}

function mergeTransactionAndAggregateData(
  processedTransactions,
  historicalPrices
) {
  // Sort the array of timestamps
  const unionTimestamps = getUnionTimestamps(
    processedTransactions,
    historicalPrices
  );

  // Initialize current portfolio state.
  // Before any transaction, we assume balance 0 and empty stock holdings.
  let currentBalance = 0;

  // Local variable for the last known historical snapshot
  let lastHistoricalSnapshot = null;

  const result = {};

  // loop through timestamps, store in result obj, the timestamps as key
  let lastCurrentStockSharesOwned;
  unionTimestamps.forEach((ts) => {
    const tsStr = ts.toString();

    // reset currentStockShares owned each iteration
    let currentStockSharesOwned = {};

    // checked if there is a transaction at this time stamp
    if (processedTransactions[tsStr]) {
      // get the transaction object at this timestamp
      const transaction = processedTransactions[tsStr];
   
      // update currentBalance
      currentBalance = transaction.balance;

      // Use a deep clone so that subsequent mutations do not affect this snapshot.
      currentStockSharesOwned = deepClone(transaction.stockSharesOwned);

      // store stock shares for timestamps in between transactions
      lastCurrentStockSharesOwned = deepClone(transaction.stockSharesOwned);
    }

    // Update the last known historical price snapshot if available.
    if (historicalPrices[tsStr]) {
      lastHistoricalSnapshot = deepClone(historicalPrices[tsStr]);
    }

    // Build the stocksOwned object using the last known historical snapshot.
    let stocksOwned = {};
    let totalInvestments = 0;

    // if there is stockShares owned use previous user transaction timestamp
    if (Object.keys(currentStockSharesOwned).length === 0) {
      currentStockSharesOwned = lastCurrentStockSharesOwned;
    }

    if (lastHistoricalSnapshot) {
      for (const [stock, shares] of Object.entries(currentStockSharesOwned)) {
        // Only consider stocks with a positive quantity and if a price exists for that stock.
        if (shares.quantity > 0 && lastHistoricalSnapshot[stock]) {
          const price = lastHistoricalSnapshot[stock].price;
          stocksOwned[stock] = {
            price,
            sharesOwned: shares.quantity,
            symbol: stock,
            purchasePrice: shares.purchasePrice,
            stockName: shares.stockName,
            stockId: shares.stockId,
          };
          const stockTotal = Math.round(price * shares.quantity * 100) / 100;
          totalInvestments =
            Math.round((totalInvestments + stockTotal) * 100) / 100;
        }
      }
    }

    result[tsStr] = {
      timestamp: ts,
      balance: currentBalance,
      stocksOwned,
      totalInvestments,
    };
  });

  return result;
}

module.exports = mergeTransactionAndAggregateData;
