const express = require("express");
const router = express.Router();
const { Stock } = require("../../db/models");
const { Op } = require("sequelize");

// * Get all stocks
router.get("/", async (req, res) => {
  const stocks = await Stock.findAll();

  return res.json({
    message: "successfully retrieved all stocks",
    stocks,
  });
});

// * Get a single stock
router.get('/:stockId', async(req, res) => {
  const { stockId } = req.params;

  return res.json({
    message: `successfully retrieved stock with id of ${stockId}`,
  });
})

module.exports = router;
