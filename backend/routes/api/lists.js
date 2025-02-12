const express = require("express");
const router = express.Router();
const { StockList, User, Stock } = require("../../db/models");
const { Op } = require("sequelize");

// * Get all lists of a user
router.get("/", async (req, res) => {
  const { id } = req.user;
  console.log("id:", id);
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

  const newList = await StockList.create(
    {
      userId: id,
      name,
      type,
      Stocks: [],
    },
    {
      include: [Stock],
    }
  );

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

  const lists = await StockList.findByPk({
    where: {
      userId: id,
      id: stockListId,
    },
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

  const list = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  await list.update({
    name: newName || stockList.name,
    type: newType || stockList.type,
  });

  return res.json(list);
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

// * stock to multiple list
// * add/remove stock to list
router.post("/update-stock-lists", async (req, res) => {
  const { stockListsIdsObj, stockId } = req.body;
  console.log("stockListsIdsObj:", stockListsIdsObj);

  const { id } = req.user;

  const stockListsUnfiltered = await Promise.all(
    Object.keys(stockListsIdsObj).map(async (listId) => {
      console.log("------>", id);
      return await StockList.findOne({
        where: {
          userId: id,
          id: listId,
        },
        include: [Stock],
      });
    })
  );

  const stockLists = stockListsUnfiltered.filter((list) => list && list);
  console.log(stockLists);

  const messages = [];
  let updatedListIds = [];
  let removedFromIds = [];
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
        removedFromIds.push(list.id);
        messages.push(`Removed ${stockId} from ${list.name} ${list.id}`);
      } else {
        messages.push(
          `${stockId} is not present in ${list.name} ${list.id} no updates were made`
        );
      }
    }
  }

  const stock = await Stock.findByPk(stockId);

  return res.json({
    messages,
    updatedListIds,
    removedFromIds,
    stock,
  });
});

module.exports = router;
