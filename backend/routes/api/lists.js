const express = require("express");
const router = express.Router();
const { StockList, User, Stock } = require("../../db/models");
const { Op } = require("sequelize");

// * Get all lists of a user
router.get("/", async (req, res) => {
  const { id } = req.user;
  const lists = await StockList.findAll({
    where: {
      userId: id,
    },
    include: [Stock],
  });

  return res.json(lists);
});

// * create a list
router.post("/", async (req, res) => {
  const { id } = req.user;

  const { name, type, stockIds } = req.body;

  const newList = await StockList.create({
    userId: id,
    name,
    type,
  });

  if (stockIds) {
    for (const stockId of stockIds) {
      await newList.addStocks(stockId);
    }
  }

  return res.json(newList);
});

// * Get a single lists
router.get("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;

  const lists = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  if (!lists) {
    return res.json({
      message: `stock list with id of ${stockListId} does not exists`,
    });
  }

  return res.json(lists);
});

// * Edit a list
router.put("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;
  const { name: newName, type: newType } = req.body;

  const list = await StockList.findByPk(stockListId);

  await list.update({
    name: newName || stockList.name,
    type: newType || stockList.type,
  });

  return res.json(list);
});

// * add stock to list
router.post("/:stockListId/:stockId", async (req, res) => {
  const { stockListId, stockId } = req.params;

  const list = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  const stockIds = list.Stocks.map((stock) => +stock.id);

  if (stockIds.includes(+stockId)) {
    return res.json({
      message: `stock with id of ${stockId} is already in the list`,
    });
  }

  await list.addStocks(stockId);

  return res.json({
    message: `successfully added Stock with id of ${stockId} to StockList with id of ${stockListId}`,
  });
});

// * stock to multiple list
// * add/remove stock to list
router.post("/update-stock-lists", async (req, res) => {
  const { stockListsIdsObj, stockId } = req.body;
  const { id } = req.user;

  const stockLists = await Promise.all(
    Object.keys(stockListsIdsObj).map(async (listId) => {
      return await StockList.findByPk(listId, { include: [Stock] });
    })
  );

  const messages = [];
  let updatedListIds = [];
  for (let list of stockLists) {
    const currentListId = list.id;
    const currentStockIds = list.Stocks.map((stock) => stock.id);

    if (stockListsIdsObj[currentListId] === true) {
      if (!currentStockIds.includes(stockId)) {
        await list.addStocks(stockId);

        updatedListIds.push(list.id);
        messages.push(`Added ${stockId} to ${list.name} ${list.id}`);
      } else {
        messages.push(
          `${stockId} is already present in ${list.name} ${list.id} no updates were made`
        );
        updatedListIds.push(list.id);
      }
    } else {
      if (currentStockIds.includes(stockId)) {
        await list.removeStocks(stockId);
        messages.push(`Removed ${stockId} from ${list.name} ${list.id}`);
      } else {
        messages.push(
          `${stockId} is not present in ${list.name} ${list.id} no updates were made`
        );
      }
    }
  }

  return res.json({
    messages,

    updatedListIds,
  });
});

// * add stock to list
router.post("/:stockListId/:stockId", async (req, res) => {
  const { stockListId, stockId } = req.params;

  const list = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  const stockIds = list.Stocks.map((stock) => +stock.id);

  if (stockIds.includes(+stockId)) {
    return res.json({
      message: `stock with id of ${stockId} is already in the list`,
    });
  }

  await list.addStocks(stockId);

  return res.json({
    message: `successfully added Stock with id of ${stockId} to StockList with id of ${stockListId}`,
  });
});

// * remove stock from list
router.delete("/:stockListId/:stockId", async (req, res) => {
  const { stockListId, stockId } = req.params;

  const list = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  if (!list) {
    return res.json({
      message: `stock list with id of ${stockListId} does not exists`,
    });
  }

  const stockIds = list.Stocks.map((stock) => +stock.id);

  if (!stockIds.includes(+stockId)) {
    return res.json({
      message: `stock with id of ${stockId} is is not in this list`,
    });
  }

  await list.removeStocks(stockId);

  return res.json({
    message: `successfully removed Stock with id of ${stockId} to StockList with id of ${stockListId}`,
  });
});

// * delete a list
router.delete("/:stockListId", async (req, res) => {
  const { stockListId } = req.params;

  const list = await StockList.findByPk(stockListId);

  await list.destroy();

  return res.json({
    message: `successfully deleted stock list with id of ${stockListId}`,
  });
});

module.exports = router;
