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

  const { name, emoji, stockIds } = req.body;
  console.log("creating list");
  console.log(name, emoji, stockIds, id);
  const newList = await StockList.create(
    {
      userId: id,
      name,
      emoji,
      Stocks: [],
    },
    {
      include: [Stock],
    }
  );
  console.log(newList);
  if (stockIds) {
    for (const stockId of stockIds) {
      await newList.addStocks(stockId);
    }
  }

  console.log(newList);
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
  const { name: newName, emoji: newEmoji } = req.body;

  const list = await StockList.findByPk(stockListId, {
    include: [Stock],
  });

  await list.update({
    name: newName || list.name,
    emoji: newEmoji || list.emoji,
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
router.post("/update-stock-lists", async (req, res) => {
  const { stockListsIdsObj, stockId } = req.body;

  const { id } = req.user;

  const stockListsUnfiltered = await Promise.all(
    Object.keys(stockListsIdsObj).map(async (listId) => {
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
