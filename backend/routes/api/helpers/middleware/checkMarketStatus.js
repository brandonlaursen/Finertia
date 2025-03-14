const checkMarketStatus = async (req, res, next) => {
  try {
    const response = await fetch(
      `https://api.polygon.io/v1/marketstatus/now?apiKey=${process.env.STOCK_API_KEY2}`
    );

    const marketStatus = await response.json();

    if (marketStatus.market === "open") {
      req.marketStatus = "open";
    } else {
      req.marketStatus = "closed";
    }
    next();
  } catch (error) {
    console.error("Error updating database:", error);
    next(error);
  }
};

module.exports = checkMarketStatus;
