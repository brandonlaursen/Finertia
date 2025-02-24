const updateStockHoldings = require("./updateStockHoldings.js");

const roundTimestampToInterval = require("./roundTimestampToInterval.js");

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

    // Round to the nearest intervals
    const roundedTo5minInterval = roundTimestampToInterval(transactionDate, 5);
    const roundedToOneHourInterval = roundTimestampToInterval(
      transactionDate,
      60
    );
    const roundedToOneDayInterval = roundTimestampToInterval(
      transactionDate,
      1440
    );

    // Summary object for each transaction
    const summary = {
      transactionDate,
      unixTimestamp,
      roundedTo5minInterval,
      // roundedToOneHourInterval,
      // roundedToOneDayInterval,
      transactionType: transaction.transactionType,
      ...(transaction.stockSymbol && { stockSymbol: transaction.stockSymbol }),
    };

    // Stock transaction processing
    if (transaction.stockSymbol) {
      const { quantity, purchasePrice, stockSymbol, transactionType } =
        transaction;
      // summary.purchaseAmount = purchasePrice;
      summary.shares = quantity;

      // Buy or sell stock
      if (transactionType === "buy") {
        balance -= purchasePrice;
        // investments += purchasePrice;
        updateStockHoldings(
          stocksHoldings,
          stockSymbol,
          quantity,
          transactionType
        ); // Buying stock
      } else {
        balance += purchasePrice;
        // investments -= purchasePrice;
        updateStockHoldings(
          stocksHoldings,
          stockSymbol,
          quantity,
          transactionType
        ); // Selling stock
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
    // console.log(summary)
    // processedTransactions.push(summary);
    const stocksHoldingsCopy = {...stocksHoldings}
    summary.stockSharesOwned = stocksHoldingsCopy;
    processedTransactions[roundedTo5minInterval] = summary

  }

  return processedTransactions;
}

module.exports = processTransactionSummary;
