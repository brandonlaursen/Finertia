const express = require("express");

const router = express.Router();

const { Op } = require("sequelize");

const { StockList, Stock } = require("../../db/models");

router.post("/", async (req, res) => {
  const { searchQuery } = req.body;

  const results = await Stock.findAll({
    where: {
      [Op.or]: [
        {
          stockName: { [Op.like]: `%${searchQuery}%` },
        },
        {
          stockSymbol: {
            [Op.like]: `%${searchQuery}%`,
          },
        },
      ],
    },
  });

  res.json(results);
});

module.exports = router;
