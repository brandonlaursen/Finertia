router.get("/stock-summary", async (req, res) => {
  const { id } = req.user;

  const MULTIPLIER_100000 = 100000;
  const MULTIPLIER_100 = 100;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  });

  //(Shares Owned×Stock Price at Time)+Cash Balance+Other Assets
  // The percentage change displayed (e.g., +3.5% today) is calculated relative to the starting portfolio value of the selected time range.

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

  // console.log('STOCK SUMMARY =====>',{stockSummary})

  return res.json({
    stockSummary,
  });
});


router.get("/stock-summary", async (req, res) => {
  const { id } = req.user;

  const userTransactions = await StockUserTransaction.findAll({
    where: { userId: id },
    include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
    order: [["purchaseDate", "ASC"]],
  });

  const accountTransactions = await UserTransaction.findAll({
    where: { userId: id },
  });

  const processor = new TransactionProcessor();
  const allTransactions = [...accountTransactions, ...userTransactions];
  const transactionData = processor.processAll(allTransactions);

  function roundToNearestInterval(timestamp, intervalMinutes) {
    const date = new Date(timestamp);
    const remainder = date.getMinutes() % intervalMinutes;
    date.setMinutes(
      remainder >= intervalMinutes / 2
        ? date.getMinutes() + (intervalMinutes - remainder)
        : date.getMinutes() - remainder,
      0,
      0
    );
    return date.getTime();
  }

  const todaysDate = new Date().getTime();

  const firstTransactionDate = allTransactions[0].transactionDate;
  console.log(" firstTransactionDate:", firstTransactionDate);



  const newDate = new Date(firstTransactionDate);
  // console.log(newDate)

  const firstUnix = newDate.getTime();
  // console.log(firstUnix)

  const roundedUnix = roundToNearestInterval(firstUnix, 5) - 11460;
  // console.log(roundedUnix);// 1740173400000

  const usersHistoricalStocks = processor.stockSharesTracker.allStocksEverOwned;

  let stockAggregates = {};
  for (let stock of usersHistoricalStocks) {
    console.log(stock);
    const oneDayDataResponse = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/range/5/minute/${roundedUnix}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
    );

    const oneDayData = await oneDayDataResponse.json();

    stockAggregates[stock] = oneDayData.results.map((aggregate) => ({
      x: aggregate.t,
      y: aggregate.c,
    }));
  }

  console.log(stockAggregates);
  console.log(" ");
  console.log(transactionData);

  let combinedData = [];
  for(let stock in stockAggregates) {

    const aggregates = stockAggregates[stock];

    for(let aggregate of aggregates) {
      const {x, y} = aggregate;
      console.log(x, y);

      if(transactionData[`${x}`]){
        console.log(transactionData[`${x}`])
      }

      break;
    }
    break;
  }

  res.end();
  // res.json({
  //   stockSharesTracker: processor.stockSharesTracker,
  //   transactionData,
  // });
});
