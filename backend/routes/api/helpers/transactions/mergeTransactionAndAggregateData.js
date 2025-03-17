function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getUnionTimestamps(transactions, prices) {
  const tsSet = new Set([...Object.keys(transactions), ...Object.keys(prices)]);
  return Array.from(tsSet)
    .map(Number)
    .sort((a, b) => a - b);
}

// * Using users historical transactions + historical stock data owned by user
// * Merge data over both sets of timestamps
// * Fill in gaps between users transactions with stock prices
// * Format and map data to show portfolio and value over time
function mergeTransactionAndAggregateData(
  processedTransactions,
  historicalPrices
) {
  // * Combine and sort the account and stock timestamps
  // * give us the timestamps we need to map users portfolio and stocks values over time
  const unionTimestamps = getUnionTimestamps(
    processedTransactions,
    historicalPrices
  );

  let currentBalance = 0;

  // * Track last transaction
  // * gives us details of what stocks are owned and how many shares a point in time
  let lastHistoricalSnapshot = null;

  const result = {};

  // * Tracks users stocks owned, before the next transaction
  // * use to fill in gap between transactions
  let lastCurrentStockSharesOwned = {};

  // * loop through timestamps, store in result obj, the timestamps as key
  unionTimestamps.forEach((ts) => {
    const tsStr = ts.toString();

    // * reset currentStockShares owned each iteration
    // * users ownership of stocks may change after a new transaction
    let currentStockSharesOwned = {};

    // * checked if there is a transaction at this time stamp
    if (processedTransactions[tsStr]) {
      // * get the transaction object at this timestamp
      const transaction = processedTransactions[tsStr];

      // * update currentBalance
      currentBalance = transaction.balance;

      // * Use a deep clone so that subsequent mutations do not affect this snapshot.
      currentStockSharesOwned = deepClone(transaction.stockSharesOwned);

      // * store stock shares for timestamps in between transactions
      // * give us how many shares a users owns of a stock at each timestamp
      lastCurrentStockSharesOwned = deepClone(transaction.stockSharesOwned);
    }

    // * Update the last known historical price snapshot if available.
    if (historicalPrices[tsStr]) {
      lastHistoricalSnapshot = deepClone(historicalPrices[tsStr]);
    }

    // added
    if (
      !currentStockSharesOwned ||
      Object.keys(currentStockSharesOwned).length === 0
    ) {
      currentStockSharesOwned = lastCurrentStockSharesOwned || {};
    }

    // * Build the stocksOwned object using the last known historical snapshot.
    let stocksOwned = {};
    let totalInvestments = 0;

    // if there is stockShares owned use previous user transaction timestamp
    if (Object.keys(currentStockSharesOwned).length === 0) {
      currentStockSharesOwned = lastCurrentStockSharesOwned;

      //if there is no lastCurrentStockSharesOwned shares owned
    }


    if (lastHistoricalSnapshot) {
      for (const [stock, shares] of Object.entries(currentStockSharesOwned)) {
        // Only consider stocks with a positive quantity and if a price exists for that stock.
        if (shares.quantity > 0 && lastHistoricalSnapshot[stock]) {
          const price = lastHistoricalSnapshot[stock].price;
          stocksOwned[stock] = {
            price,
            sharesOwned: Number(shares.quantity),
            symbol: stock,
            purchasePrice: Number(shares.purchasePrice),
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
      stocksOwned: stocksOwned ?? {},
      totalInvestments,
    };
  });

  return result;
}

module.exports = mergeTransactionAndAggregateData;
