const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");
const { sequelize } = require("../../db/models");

const processTransactionSummary = require("./helpers/processTransactionSummary.js");
const processHistoricalData = require("./helpers/processHistoricalData.js");
const mergeTransactionAndAggregateData = require("./helpers/mergeTransactionAndAggregateData.js");
const gatherAggregates = require("./helpers/gatherAggregates.js");

router.post("/deposit", async (req, res) => {
  const { id, balance } = req.user;
  console.log(" balance:", balance);

  const { amount } = req.body;

  const user = await User.findByPk(id);
  console.log(" user:", user);

  const newBalance = Number(balance) + Number(amount);

  await user.update({
    balance: Number(newBalance),
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
    balance: Number(newBalance),
    message: `successfully deposited ${amount} for user with id of ${id}, new balance is ${newBalance}`,
  });
});

router.post("/withdraw", async (req, res) => {
  const { id, balance } = req.user;

  const { amount } = req.body;

  const user = await User.findByPk(id);

  const newBalance = Number(balance) - Number(amount);

  if (newBalance < 0) {
    return res.json({
      message: `Not enough funds`,
      balance: Number(balance),
    });
  }

  await user.update({
    balance: Number(newBalance),
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
    balance: Number(newBalance),
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

router.get("/stock-summary", async (req, res) => {
  const { id } = req.user;

  const t = await sequelize.transaction();

  try {
    const [userTransactions, accountTransactions] = await Promise.all([
      StockUserTransaction.findAll({
        where: { userId: id },
        include: [
          { model: Stock, attributes: ["id", "stockSymbol", "stockName"] },
        ],
        order: [["purchaseDate", "DESC"]],
        transaction: t,
      }),
      UserTransaction.findAll({
        where: { userId: id },
        order: [["transactionDate", "DESC"]],
        transaction: t,
      }),
    ]);

    if (accountTransactions.length === 0) {
      const userSummary = {
        totalInvestments: 0,
        balance: 0,
        stocksOwned: {},
        oneDayAggregates: [],
        oneWeekAggregates: [],
        oneMonthAggregates: [],
        threeMonthsAggregates: [],
        oneYearAggregates: [],
        fiveYearsAggregates: [],
      };
      await t.rollback();
      return res.json(userSummary);
    }
    const processedTransactions = processTransactionSummary(
      userTransactions,
      accountTransactions
    );

    const processedHistoricalData = await processHistoricalData(
      processedTransactions
    );

    const mergedTransactionData = mergeTransactionAndAggregateData(
      processedTransactions,
      processedHistoricalData
    );

    const mergedTransactionDataArray = Object.values(mergedTransactionData);
    const lastTransaction =
      mergedTransactionDataArray[mergedTransactionDataArray.length - 1];

    const userHistoricalData = Object.values(mergedTransactionData).map(
      (data) => ({
        x: data.timestamp,
        y: data.totalInvestments,
      })
    );

    const aggregates = gatherAggregates(userHistoricalData);

    await t.commit();

    const userSummary = {
      totalInvestments: lastTransaction.totalInvestments,
      balance: Number(lastTransaction.balance),
      stocksOwned: lastTransaction.stocksOwned,
      ...aggregates,
    };
    console.log(" userSummary:", userSummary);

    return res.json(userSummary);
  } catch (error) {
    await t.rollback();
    console.error("Stock summary error:", error);
    return res.status(500).json({
      message: "An error occurred while fetching stock summary",
      error: error.message,
    });
  }
});

router.post("/trade/:stockId", async (req, res) => {
  const { id, balance } = req.user;

  const {
    stockId,
    stockPrice,
    quantity,
    tradeType: transactionType,
    stockName,
    stockSymbol,
  } = req.body;

  stockId, stockPrice, quantity, stockName, stockSymbol;

  const t = await sequelize.transaction();

  try {
    const user = await User.findByPk(id);

    const MULTIPLIER_100000 = 100000;
    const MULTIPLIER_100 = 100;

    const roundedPrice =
      Math.round(Number(stockPrice) * MULTIPLIER_100) / MULTIPLIER_100;
    const roundedQuantity =
      Math.round(Number(quantity) * MULTIPLIER_100000) / MULTIPLIER_100000;

    const amount = roundedPrice * roundedQuantity;

    const roundedAmount = Math.round(amount * MULTIPLIER_100) / MULTIPLIER_100;

    // Check if user has enough balance for buy
    if (transactionType === "buy" && balance < roundedAmount) {
      return res.status(400).json({
        message: "Insufficient funds for this transaction",
      });
    }

    let newBalance;
    if (transactionType === "buy") {
      newBalance = balance - roundedAmount;
    } else if (transactionType === "sell") {
      newBalance = balance + roundedAmount;
    }

    newBalance = Math.round(newBalance * MULTIPLIER_100) / MULTIPLIER_100;

    await StockUserTransaction.create(
      {
        userId: id,
        stockId,
        transactionType,
        quantity,
        stockName,
        stockSymbol,
        purchasePrice: roundedAmount,
        purchaseDate: new Date(),
      },
      { transaction: t }
    );

    // Update user balance within the same transaction
    await user.update(
      {
        balance: Number(newBalance),
      },
      { transaction: t }
    );

    // Fetch updated transaction data within the same transaction
    const userTransactions = await StockUserTransaction.findAll({
      where: { userId: id },
      include: [
        { model: Stock, attributes: ["id", "stockSymbol", "stockName"] },
      ],
      order: [["purchaseDate", "DESC"]],
      transaction: t,
    });

    // Calculate aggregates with the latest transaction included
    const processedTransactions = processTransactionSummary(
      userTransactions,
      await UserTransaction.findAll({
        where: { userId: id },
        transaction: t,
      })
    );

    const processedHistoricalData = await processHistoricalData(
      processedTransactions
    );

    const mergedTransactionData = mergeTransactionAndAggregateData(
      processedTransactions,
      processedHistoricalData
    );

    // const mergedTransactionDataArray = Object.values(mergedTransactionData);

    const userHistoricalData = Object.values(mergedTransactionData).map(
      (data) => ({
        x: data.timestamp,
        y: data.totalInvestments,
      })
    );

    const aggregates = gatherAggregates(userHistoricalData);

    await t.commit();

    const safeUser = {
      id: req.user.id,
      email: req.user.email,
      username: req.user.username,
      balance: Number(newBalance),
      profilePic: req.user.profilePic,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      joinDate: req.user.createdAt,
    };

    return res.json({
      user: safeUser,
      aggregates,
      message: `successfully processed trade for user with id of ${id}`,
    });
  } catch (error) {
    // Rollback the transaction if anything goes wrong
    await t.rollback();
    console.error("Trade error:", error);
    return res.status(500).json({
      message: "An error occurred while processing the trade",
      error: error.message,
    });
  }
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
