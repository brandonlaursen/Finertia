const updateStockHoldings = require("./updateStockHoldings.js");

const roundTimestampToInterval = require("./roundTimestampToInterval.js");


// * Get users withdraw/deposits with timestamp
// * Get users owned stocks
// * Get timestamps of portfolio changes over time
function processTransactionSummary(userTransactions, accountTransactions) {
  const allTransactions = [...userTransactions, ...accountTransactions].sort(
    (a, b) =>
      new Date(a.purchaseDate || a.transactionDate) -
      new Date(b.purchaseDate || b.transactionDate)
  );

  let balance = 0;
  let investments = 0;
  const stocksHoldings = {};
  const processedTransactions = {};

  for (let transaction of allTransactions) {
    const transactionDate =
      transaction.purchaseDate || transaction.transactionDate;
    const unixTimestamp = new Date(transactionDate).getTime();

    const roundedTo5minInterval = roundTimestampToInterval(transactionDate, 5);

    const summary = {
      transactionDate,
      unixTimestamp,
      roundedTo5minInterval,
      transactionType: transaction.transactionType,
      ...(transaction.stockSymbol && { stockSymbol: transaction.stockSymbol }),
    };

    // Stock transaction processing
    if (transaction.stockSymbol) {
      const {
        quantity,
        purchasePrice,
        stockSymbol,
        transactionType,
        stockId,
        stockName,
      } = transaction;

      // summary.purchaseAmount = purchasePrice;
      summary.shares = quantity;

      if (transactionType === "buy") {
        balance -= purchasePrice;
        investments += purchasePrice;
        updateStockHoldings(
          stocksHoldings,
          stockSymbol,
          quantity,
          transactionType,
          stockId,
          purchasePrice,
          stockName
        );
      } else {
        balance += purchasePrice;
        investments -= purchasePrice;
        updateStockHoldings(
          stocksHoldings,
          stockSymbol,
          quantity,
          transactionType,
          stockId,
          purchasePrice,
          stockName
        );
      }
    } else {
      // Non-stock transactions (e.g., deposit/withdraw)
      const amount = transaction.amount;
      if (transaction.transactionType === "deposit") {
        balance += amount;
      } else {
        balance -= amount;
      }
    }

    // Add to summary
    summary.balance = balance;
    summary.investments = investments;

    const stocksHoldingsCopy = JSON.parse(JSON.stringify(stocksHoldings));
    summary.stockSharesOwned = stocksHoldingsCopy;
    processedTransactions[roundedTo5minInterval] = summary;
  }

  return processedTransactions;
}

module.exports = processTransactionSummary;
