const express = require("express");
const router = express.Router();
const { StockList, User, Stock } = require("../../db/models");
const { Op } = require("sequelize");

// ! TODO
// * Add error handling
// * add validators
// * add check for authorization
// * add status codes
// * refactor to follow DRY

// * Get all lists of a user
router.get("/", async (req, res) => {
  const { id } = req.user;
  const allStockList = await StockList.findAll({
    where: {
      userId: id,
    },
    include: [Stock],
  });

  return res.json({
    message: "successfully retrieved all StockList",
    allStockList,
  });
});

// * create a list
router.post("/", async (req, res) => {
  const { id } = req.user;
  const { stockListId } = req.params;
  const { name, type, stockIds } = req.body;

  const newStockList = await StockList.create({
    userId: id,
    name,
    type,
  });

  if (stockIds) {
    for (const stockId of stockIds) {
      await newStockList.addStocks(stockId);
    }
  }

  return res.json({
    message: `successfully updated StockList with id of ${stockListId}`,
    newStockList,
  });
});

// * Get a single lists
router.get("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;

  const stockList = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  if (!stockList) {
    return res.json({
      message: `stock list with id of ${stockListId} does not exists`,
    });
  }

  return res.json({
    message: `successfully retrieved StockList with id of ${stockListId}`,
    stockList,
  });
});

// * Edit a list
router.put("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;
  const { name: newName, type: newType } = req.body;

  const stockList = await StockList.findByPk(stockListId);

  await stockList.update({
    name: newName || name,
    type: newType || type,
  });

  return res.json({
    message: `successfully updated StockList with id of ${stockListId}`,
    stockList,
  });
});

// * add stock to list
router.post("/:stockListId/:stockId", async (req, res) => {
  const { stockListId, stockId } = req.params;

  const stockList = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  const stockIds = stockList.Stocks.map((stock) => +stock.id);

  if (stockIds.includes(+stockId)) {
    return res.json({
      message: `stock with id of ${stockId} is already in the list`,
    });
  }

  await stockList.addStocks(stockId);

  return res.json({
    message: `successfully added Stock with id of ${stockId} to StockList with id of ${stockListId}`,
  });
});

// * remove stock from list
router.delete("/:stockListId/:stockId", async (req, res) => {
  const { stockListId, stockId } = req.params;

  const stockList = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  if (!stockList) {
    return res.json({
      message: `stock list with id of ${stockListId} does not exists`,
    });
  }

  const stockIds = stockList.Stocks.map((stock) => +stock.id);

  if (!stockIds.includes(+stockId)) {
    return res.json({
      message: `stock with id of ${stockId} is is not in this list`,
    });
  }

  await stockList.removeStocks(stockId);

  return res.json({
    message: `successfully removed Stock with id of ${stockId} to StockList with id of ${stockListId}`,
  });
});

// * delete a list
router.delete("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;

  const stockList = await StockList.findByPk(stockListId);

  await stockList.destroy();

  return res.json({
    message: `successfully deleted stock list with id of ${stockListId}`,
  });
});

module.exports = router;
