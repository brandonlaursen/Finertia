const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");

const processTransactionSummary = require("./helpers/processTransactionSummary.js");
const { getDate } = require("./helpers/getDate.js");

router.post("/deposit", async (req, res) => {
  const { id, balance } = req.user;

  const { amount } = req.body;

  const user = await User.findByPk(id);

  const newBalance = balance + Number(amount);

  await user.update({
    balance: newBalance,
  });

  const transaction = {
    amount,
    transactionType: "deposit",
    transactionDate: new Date(),
  };

  await UserTransaction.create({
    userId: id,
    ...transaction,
  });

  return res.json({
    transaction,
    balance: newBalance,
    message: `successfully deposited ${amount} for user with id of ${id}, new balance is ${newBalance}`,
  });
});

router.post("/withdraw", async (req, res) => {
  const { id, balance } = req.user;

  const { amount } = req.body;

  const user = await User.findByPk(id);

  const newBalance = balance - amount;

  if (newBalance < 0) {
    return res.json({
      message: `Not enough funds`,
      balance,
    });
  }

  await user.update({
    balance: newBalance,
  });

  const transaction = {
    amount,
    transactionType: "withdraw",
    transactionDate: new Date(),
  };

  await UserTransaction.create({
    userId: id,
    ...transaction,
  });

  return res.json({
    transaction,
    balance: newBalance,
    message: `successfully withdrew ${amount} for user with id of ${id}, new balance is ${newBalance}`,
  });
});

router.get("/stock-transactions", async (req, res) => {
  const { id } = req.user;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  const transactions = userTransactions.map((transaction) => {
    const {
      stockId,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
      Stock,
    } = transaction;

    return {
      stockId,
      stockSymbol: Stock.stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    };
  });

  return res.json({
    transactions,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});
// router.get("/stock-summary", async (req, res) => {
//   const { id } = req.user;

//   const MULTIPLIER_100000 = 100000;
//   const MULTIPLIER_100 = 100;

//   const userTransactions = await StockUserTransaction.findAll({
//     where: { userId: id },
//     include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
//   });

//   //(Shares Owned×Stock Price at Time)+Cash Balance+Other Assets
//   // The percentage change displayed (e.g., +3.5% today) is calculated relative to the starting portfolio value of the selected time range.

//   const transactions = userTransactions.map((transaction) => {
//     const {
//       stockId,
//       transactionType,
//       quantity,
//       purchasePrice,
//       purchaseDate,
//       Stock,
//     } = transaction;

//     return {
//       stockId,
//       stockName: Stock.stockName,
//       stockSymbol: Stock.stockSymbol,
//       transactionType,
//       quantity,
//       purchasePrice,
//       purchaseDate,
//     };
//   });

//   const stockSummary = {};

//   transactions.forEach((transaction) => {
//     const {
//       stockId,
//       stockName,
//       stockSymbol,
//       transactionType,
//       quantity,
//       purchasePrice,
//       purchaseDate,
//     } = transaction;

//     if (!stockSummary[stockSymbol]) {
//       stockSummary[stockSymbol] = {
//         stockId,
//         stockName,
//         stockSymbol,
//         sharesOwned: 0,
//         totalAmountOwned: 0,
//         transactions: [],
//       };
//     }

//     // current user values
//     const sharesOwned = stockSummary[stockSymbol].sharesOwned;
//     const totalAmountOwned = stockSummary[stockSymbol].totalAmountOwned;

//     // rounded user values
//     const roundedSharesOwned =
//       Math.round(Number(sharesOwned) * MULTIPLIER_100000) / MULTIPLIER_100000;
//     const roundedTotalAmountOwned =
//       Math.round(Number(totalAmountOwned) * MULTIPLIER_100) / MULTIPLIER_100;

//     // rounded stock quantity
//     const roundedQuantity =
//       Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;
//     // rounded stock price
//     const roundedPrice =
//       Math.round(Number(purchasePrice) * MULTIPLIER_100) / MULTIPLIER_100;

//     if (transactionType === "buy") {
//       stockSummary[stockSymbol].sharesOwned =
//         Math.round((roundedSharesOwned + roundedQuantity) * MULTIPLIER_100000) /
//         MULTIPLIER_100000;

//       stockSummary[stockSymbol].totalAmountOwned =
//         Math.round(
//           (roundedTotalAmountOwned + roundedQuantity * roundedPrice) *
//             MULTIPLIER_100
//         ) / MULTIPLIER_100;
//     } else if (transactionType === "sell") {
//       stockSummary[stockSymbol].sharesOwned =
//         Math.round((roundedSharesOwned - roundedQuantity) * MULTIPLIER_100000) /
//         MULTIPLIER_100000;

//       stockSummary[stockSymbol].totalAmountOwned =
//         Math.round(
//           (roundedTotalAmountOwned - roundedQuantity * roundedPrice) *
//             MULTIPLIER_100
//         ) / MULTIPLIER_100;
//     }

//     if (stockSummary[stockSymbol].sharesOwned > 0) {
//       stockSummary[stockSymbol].transactions.push({
//         stockId,
//         stockName,
//         stockSymbol,
//         transactionType: transaction.transactionType,
//         quantity,
//         purchasePrice,
//         purchaseDate,
//       });
//     }
//   });

//   for (const stockSymbol in stockSummary) {
//     const stockData = stockSummary[stockSymbol];

//     if (stockData.totalAmountOwned <= 0 || stockData.sharesOwned <= 0) {
//       delete stockSummary[stockSymbol];
//     } else {
//       stockData.averageCost = Number(
//         (stockData.totalAmountOwned / stockData.sharesOwned).toFixed(2)
//       );
//     }
//   }

//   // console.log('STOCK SUMMARY =====>',{stockSummary})

//   return res.json({
//     stockSummary,
//   });
// });

router.get("/stock-summary", async (req, res) => {
  console.log("-----------------------------------------------------------");
  console.log("             ");

  const { id } = req.user;

  const [userTransactions, accountTransactions] = await Promise.all([
    StockUserTransaction.findAll({
      where: { userId: id },
      include: [
        { model: Stock, attributes: ["id", "stockSymbol", "stockName"] },
      ],
      order: [["purchaseDate", "ASC"]],
    }),
    UserTransaction.findAll({
      where: { userId: id },
    }),
  ]);

  // console.log(accountTransactions)

  const processedTransactions = processTransactionSummary(
    userTransactions,
    accountTransactions
  );

  // console.log(processedTransactions)
  const processedTransactionsArr = Object.values(processedTransactions);
  // console.log(processedTransactionsArr);

  const lastProcessedTransaction =
    processedTransactionsArr[processedTransactionsArr.length - 1];
  const stockOwnedAtSomePoint = lastProcessedTransaction.stockSharesOwned;

  const todaysDate = getDate();
  const oneDayAway = getDate(1);
  const oneWeekAway = getDate(7);

  let historicalData = {
    ...processedTransactions,

    1739869200000: {
      unixTimestamp: 1740348298743,
      roundedTo5minInterval: 1740348300000,
      transactionType: "buy",
      stockSymbol: "META",
      shares: 0.14644,
      balance: 500,
      investments: 0,
      stockSharesOwned: { AAPL: 0, META: 0.29287 },
    },
  };
  // console.log(historicalData);
  let temp;
  for (let stockSymbol of Object.keys(stockOwnedAtSomePoint)) {
    console.log(stockSymbol);
    const [oneWeekDataResponse] = await Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneWeekAway}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
    ]);

    let [oneWeekData] = await Promise.all([oneWeekDataResponse.json()]);

    const aggregates = oneWeekData.results;

    for (let aggregate of aggregates) {
      if (!historicalData[aggregate.t]) {
        historicalData[aggregate.t] = {};
      } else {
        if (historicalData[aggregate.t].stockSharesOwned) {
          temp = historicalData[aggregate.t].stockSharesOwned;
          balance = historicalData[aggregate.t].balance;
        }

        if (!historicalData[aggregate.t][stockSymbol]) {
          historicalData[aggregate.t][stockSymbol] = {
            stockSymbol,
            price: aggregate.c,
          };
        }
      }
      if (!historicalData[aggregate.t][stockSymbol]) {
        historicalData[aggregate.t][stockSymbol] = {
          stockSymbol,
          price: aggregate.c,
        };
      }
      historicalData[aggregate.t].stockSharesOwned = temp;
      historicalData[aggregate.t].balance = balance;
      // console.log(historicalData[aggregate.t], "====--======");
      // console.log("1 ");
      // console.log(historicalData[aggregate.t][stockSymbol]);
      // console.log(historicalData[aggregate.t][stockSymbol].price);
      // console.log("2 ");
      // // console.log(historicalData[aggregate.t].stockSharesOwned[stockSymbol]);

      // console.log("3 ", stockSymbol);
      // console.log("-----------------------------------");
      // console.log(
      //   "4.",
      //   historicalData[aggregate.t].stockSharesOwned[stockSymbol]
      // );
      const sharesOwned =
        historicalData[aggregate.t].stockSharesOwned[stockSymbol];
      // console.log(sharesOwned)

      const stockPrice = historicalData[aggregate.t][stockSymbol].price;
      // console.log(stockPrice)
      const stockValue = Math.round(sharesOwned * stockPrice * 100) / 100;

      // console.log('--',stockValue);
      // console.log(historicalData[aggregate.t])
      historicalData[aggregate.t][stockSymbol].stockValue = stockValue;
    }
  }

  // console.log(historicalData);

  function convertToTimestampArray(data) {
    return Object.entries(data).map(([timestamp, entry]) => {
      const totalStockValue = Object.values(entry)
        .filter((item) => typeof item === "object" && "stockValue" in item)
        .reduce((sum, stock) => sum + stock.stockValue, 0);

      return {
        x: Number(timestamp), // Convert timestamp string to number
        y: Math.round((entry.balance + totalStockValue) * 100) / 100, // Sum of balance and total stock value
      };
    });
  }

  const formattedData = convertToTimestampArray(historicalData);
  const sortedData = formattedData.sort((a, b) => b.x - a.x);

  console.log(sortedData);

  // const userAggregates = [];

  // for(let timestamp in userAggregates) {

  //   if(!userAggregates[timestamp]) {
  //     userAggregates[timestamp] = {};
  //   }
  // }

  res.end();
});

router.post("/trade/:stockId", async (req, res) => {
  const { id, balance } = req.user;

  const {
    stockId,
    stockPrice,
    quantity,
    transactionType,
    stockName,
    stockSymbol,
  } = req.body;

  console.log({
    stockId,
    stockPrice,
    quantity,
    transactionType,
    stockName,
    stockSymbol,
  });
  const user = await User.findByPk(id);

  // Constants
  const MULTIPLIER_100000 = 100000;
  const MULTIPLIER_100 = 100;

  // Round price and quantity
  const roundedPrice =
    Math.round(Number(stockPrice) * MULTIPLIER_100) / MULTIPLIER_100;
  const roundedQuantity =
    Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;

  // Calculate amount (price * quantity)
  const amount = roundedPrice * roundedQuantity;

  // Round the amount to 2 decimal places (since it's a currency value)
  const roundedAmount = Math.round(amount * MULTIPLIER_100) / MULTIPLIER_100;

  let newBalance;
  if (transactionType === "buy") {
    newBalance = balance - roundedAmount;
  } else if (transactionType === "sell") {
    newBalance = balance + roundedAmount;
  }

  newBalance = Math.round(newBalance * MULTIPLIER_100) / MULTIPLIER_100;

  const transaction = await StockUserTransaction.create({
    userId: id,
    stockId,
    transactionType,
    quantity,
    stockName,
    stockSymbol,
    purchasePrice: roundedAmount,
    purchaseDate: new Date(),
  });
  console.log(transaction);

  await user.update({
    balance: newBalance,
  });

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  const transactions = userTransactions.map((transaction) => {
    const {
      stockId,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
      Stock,
    } = transaction;

    return {
      stockId,
      stockName: Stock.stockName,
      stockSymbol: Stock.stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    };
  });

  const stockSummary = {};

  transactions.forEach((transaction) => {
    const {
      stockId,
      stockName,
      stockSymbol,
      transactionType,
      quantity,
      purchasePrice,
      purchaseDate,
    } = transaction;

    if (!stockSummary[stockSymbol]) {
      stockSummary[stockSymbol] = {
        stockId,
        stockName,
        stockSymbol,
        sharesOwned: 0,
        totalAmountOwned: 0,
        transactions: [],
      };
    }

    // current user values
    const sharesOwned = stockSummary[stockSymbol].sharesOwned;
    const totalAmountOwned = stockSummary[stockSymbol].totalAmountOwned;

    // rounded user values
    const roundedSharesOwned =
      Math.round(Number(sharesOwned) * MULTIPLIER_100000) / MULTIPLIER_100000;
    const roundedTotalAmountOwned =
      Math.round(Number(totalAmountOwned) * MULTIPLIER_100) / MULTIPLIER_100;

    // rounded stock quantity
    const roundedQuantity =
      Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;
    // rounded stock price
    const roundedPrice =
      Math.round(Number(purchasePrice) * MULTIPLIER_100) / MULTIPLIER_100;

    if (transactionType === "buy") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned + roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned + roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    } else if (transactionType === "sell") {
      stockSummary[stockSymbol].sharesOwned =
        Math.round((roundedSharesOwned - roundedQuantity) * MULTIPLIER_100000) /
        MULTIPLIER_100000;

      stockSummary[stockSymbol].totalAmountOwned =
        Math.round(
          (roundedTotalAmountOwned - roundedQuantity * roundedPrice) *
            MULTIPLIER_100
        ) / MULTIPLIER_100;
    }

    if (stockSummary[stockSymbol].sharesOwned > 0) {
      stockSummary[stockSymbol].transactions.push({
        stockId,
        stockName,
        stockSymbol,
        transactionType: transaction.transactionType,
        quantity,
        purchasePrice,
        purchaseDate,
      });
    }
  });

  for (const stockSymbol in stockSummary) {
    const stockData = stockSummary[stockSymbol];

    if (stockData.totalAmountOwned <= 0 || stockData.sharesOwned <= 0) {
      delete stockSummary[stockSymbol];
    } else {
      stockData.averageCost = Number(
        (stockData.totalAmountOwned / stockData.sharesOwned).toFixed(2)
      );
    }
  }

  // const highestPriceEntry = await StockPriceTimestamp.findOne({
  //   where: {
  //     stockId: stock.id,
  //   },
  //   order: [
  //     ["timestamp", "DESC"],
  //   ],
  //   limit: 1,
  // });

  return res.json({
    transaction,
    balance: newBalance,
    stockSummary,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});

// * Get users transactions
router.get("/", async (req, res) => {
  const { id } = req.user;

  const userTransactions = await UserTransaction.findAll({
    where: {
      userId: id,
    },
  });

  const transactions = userTransactions.map((transaction) => {
    const { amount, transactionType, transactionDate } = transaction;
    return {
      amount,
      transactionType,
      transactionDate,
    };
  });

  return res.json({
    transactions,
    message: `successfully retrieved transactions for user with id of ${id}`,
  });
});
module.exports = router;
