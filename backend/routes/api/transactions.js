const express = require("express");
const router = express.Router();
const {
  User,
  UserTransaction,
  StockUserTransaction,
  Stock,
} = require("../../db/models");
const { sequelize } = require("../../db/models");

const processTransactionSummary = require("./helpers/transactions/processTransactionSummary.js");
const processHistoricalData = require("./helpers/transactions/processHistoricalData.js");
const mergeTransactionAndAggregateData = require("./helpers/transactions/mergeTransactionAndAggregateData.js");
const gatherAggregates = require("./helpers/transactions/gatherAggregates.js");
const formatMergedTransactions = require("./helpers/transactions/formatMergedTransactions.js");

router.post("/deposit", async (req, res) => {
  try {
    // Validate request body
    const { amount } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount." });
    }

    // Validate user
    const { id, balance } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate new balance
    const newBalance = Number(balance) + Number(amount);

    // Update balance in the database
    await user.update({ balance: newBalance });

    // Create a transaction record
    const transaction = await UserTransaction.create({
      userId: id,
      amount: Number(amount),
      transactionType: "deposit",
      transactionDate: new Date(),
    });

    // Send response
    return res.json({
      transaction,
      balance: newBalance,
      message: `Successfully deposited $${amount} for user with ID ${id}. New balance: $${newBalance}`,
    });
  } catch (error) {
    console.error("Deposit error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});
router.post("/withdraw", async (req, res) => {
  try {
    // Validate request body
    const { amount } = req.body;
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ error: "Invalid withdrawal amount." });
    }

    // Validate user
    const { id, balance } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Calculate new balance
    const newBalance = Number(balance) - Number(amount);

    // Check if the user has enough funds
    if (newBalance < 0) {
      return res.status(400).json({
        error: "Insufficient funds.",
        balance: Number(balance),
      });
    }

    // Update balance in the database
    await user.update({ balance: newBalance });

    // Create a transaction record
    const transaction = await UserTransaction.create({
      userId: id,
      amount: Number(amount),
      transactionType: "withdraw",
      transactionDate: new Date(),
    });

    // Send response
    return res.json({
      transaction,
      balance: newBalance,
      message: `Successfully withdrew $${amount} for user with ID ${id}. New balance: $${newBalance}`,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
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
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
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

    // * Gather users stock and account transactions with timestamps
    // * Track whats stocks are owned at what time and how many shares
    const processedTransactions = processTransactionSummary(
      userTransactions,
      accountTransactions
    );

    // * Gather stocks owned by user historical data
    // * Track stocks owned by users historical prices over time
    const processedHistoricalData = await processHistoricalData(
      processedTransactions
    );


    // * Merge users and stocks data + timestamps
    // * Create a timeline of portfolio changes + value
    // * Fill in gaps between users transactions
    const mergedTransactionData = mergeTransactionAndAggregateData(
      processedTransactions,
      processedHistoricalData
    );



    // * Get details of last transaction
    // * Get formatted historical data
    const { lastTransaction, userHistoricalData } = formatMergedTransactions(
      mergedTransactionData
    );


    // * Organize data into timeframes - ie: 1D, 1W, 1M, 3M, 1Y, 5Y
    const aggregates = gatherAggregates(userHistoricalData);

    await t.commit();

    const userSummary = {
      totalInvestments: lastTransaction.totalInvestments || 0,
      balance: Number(lastTransaction.balance),
      stocksOwned: lastTransaction.stocksOwned,
      ...aggregates,
    };

    console.log(userSummary)
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

    await user.update(
      {
        balance: Number(newBalance),
      },
      { transaction: t }
    );

    const userTransactions = await StockUserTransaction.findAll({
      where: { userId: id },
      include: [
        { model: Stock, attributes: ["id", "stockSymbol", "stockName"] },
      ],
      order: [["purchaseDate", "DESC"]],
      transaction: t,
    });

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
