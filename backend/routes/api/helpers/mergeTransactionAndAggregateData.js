
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

    // Build the stockOwned object using the last known historical snapshot (if any)
    let stockOwned = {};
    let totalInvestments = 0;

    if (lastHistoricalSnapshot) {
      for (const [stock, shares] of Object.entries(currentStockSharesOwned)) {
        if (shares > 0 && lastHistoricalSnapshot[stock]) {
          const price = lastHistoricalSnapshot[stock].price;
          stockOwned[stock] = { price, sharesOwned: shares };
          const stockTotal = Math.round((price * shares) * 100) / 100;
          const newTotalInvestments = Math.round((totalInvestments + stockTotal) * 100) / 100;
          totalInvestments = newTotalInvestments;
        }
      }
    }

    result[tsStr] = {
      balance: currentBalance,
      stockOwned,
      totalInvestments
    };
  });


  return result;
}




module.exports = mergeTransactionAndAggregateData;

/*
processedTransactions
},
  '1740411000000': {
    transactionDate: 2025-02-24T15:28:57.224Z,
    unixTimestamp: 1740410937224,
    roundedTo5minInterval: 1740411000000,
    transactionType: 'buy',
    stockSymbol: 'TSLA',
    shares: 0.30286,
    balance: 250,
    investments: 450,
    stockSharesOwned: { AAPL: 0.60592, META: 0.29764, TSLA: 0.30286 }
  }

*/

/*
aggregateData
  },
  '1740393000000': {
    TSLA: { price: 337.77 },
    AAPL: { price: 245.2 },
    META: { price: 686.78 }
  },
  '1740393300000': {
    TSLA: { price: 338.03 },
    AAPL: { price: 245.2 },
    META: { price: 686.78 }
  },
  '1740394500000': {
    TSLA: { price: 337.76 },
    AAPL: { price: 245.21 },
    META: { price: 686.7 }
  }
*/
