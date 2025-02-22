const { StockUserTransaction } = require("../../../db/models");

class TransactionProcessor {
  constructor() {
    this.stockSharesTracker = { balance: 0, allStocksEverOwned: new Set() };
    this.transactionGroups = {};
  }

  roundToNearestInterval(timestamp, intervalMinutes) {
    const date = new Date(timestamp);
    const remainder = date.getMinutes() % intervalMinutes;
    date.setMinutes(
      remainder >= intervalMinutes / 2
        ? date.getMinutes() + (intervalMinutes - remainder)
        : date.getMinutes() - remainder,
      0,
      0
    );
    return date.getTime();
  }

  updateBalance(transactionType, amount) {
    const MULTIPLIER_100 = 100;
    let balance =
      Math.round(this.stockSharesTracker.balance * MULTIPLIER_100) /
      MULTIPLIER_100;
    let amountFixed = Math.round(amount * MULTIPLIER_100) / MULTIPLIER_100;

    if (transactionType === "withdraw") {
      balance = Math.max(0, balance - amountFixed);
    } else if (transactionType === "deposit") {
      balance += amountFixed;
    }

    this.stockSharesTracker.balance =
      Math.round(balance * MULTIPLIER_100) / MULTIPLIER_100;
  }

  updateShares(stockSymbol, transactionType, quantity, purchasePrice) {
    const MULTIPLIER_100000 = 100000;
    const MULTIPLIER_100 = 100;

    if (!this.stockSharesTracker[stockSymbol]) {
      this.stockSharesTracker[stockSymbol] = { totalShares: 0 };
    }

    const stock = this.stockSharesTracker[stockSymbol];
    let currentShares =
      Math.round(stock.totalShares * MULTIPLIER_100000) / MULTIPLIER_100000;
    let quantityFixed =
      Math.round(quantity * MULTIPLIER_100000) / MULTIPLIER_100000;
    let totalPrice =
      Math.round(purchasePrice * quantityFixed * MULTIPLIER_100) /
      MULTIPLIER_100;

    if (transactionType === "buy") {
      if (this.stockSharesTracker.balance >= totalPrice) {
        stock.totalShares =
          Math.round((currentShares + quantityFixed) * MULTIPLIER_100000) /
          MULTIPLIER_100000;
        this.stockSharesTracker.balance =
          Math.round(
            (this.stockSharesTracker.balance - totalPrice) * MULTIPLIER_100
          ) / MULTIPLIER_100;
        if (!this.stockSharesTracker.allStocksEverOwned.has(stockSymbol)) {
          this.stockSharesTracker.allStocksEverOwned.add(stockSymbol);
        }
      } else {
        console.log("Insufficient balance to buy shares.");
      }
    } else if (transactionType === "sell") {
      if (currentShares >= quantityFixed) {
        stock.totalShares =
          Math.round((currentShares - quantityFixed) * MULTIPLIER_100000) /
          MULTIPLIER_100000;
        this.stockSharesTracker.balance =
          Math.round(
            (this.stockSharesTracker.balance + totalPrice) * MULTIPLIER_100
          ) / MULTIPLIER_100;
      } else {
        console.log("Insufficient shares to sell.");
        stock.totalShares = 0;
      }
    }
  }

  processTransaction(transaction) {
    const isStockTransaction = transaction instanceof StockUserTransaction;
    const timestamp = isStockTransaction
      ? transaction.purchaseDate
      : transaction.transactionDate;
    const roundedTime = this.roundToNearestInterval(timestamp, 5);

    if (!this.transactionGroups[roundedTime]) {
      this.transactionGroups[roundedTime] = {
        balance: this.stockSharesTracker.balance,
      };
    }

    if (isStockTransaction) {
      const {
        stockSymbol,
        stockName,
        transactionType,
        quantity,
        purchasePrice,
      } = transaction;
      this.updateShares(stockSymbol, transactionType, quantity, purchasePrice);

      this.transactionGroups[roundedTime][stockSymbol] = {
        stockName,
        stockSymbol,
        quantity,
        transactionType,
        totalSharesAtTime: this.stockSharesTracker[stockSymbol].totalShares,
      };
    } else {
      const { transactionType, amount } = transaction;
      this.updateBalance(transactionType, amount);
    }
  }

  processAll(transactions) {
    transactions.forEach((transaction) => this.processTransaction(transaction));
    return this.transactionGroups;
  }
}

module.exports = { TransactionProcessor };
