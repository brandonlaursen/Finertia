  const [
      oneDayAggregatesJSON,
      oneWeekAggregatesJSON,
      oneMonthAggregatesJSON,
      threeMonthAggregatesJSON,
      oneYearAggregatesJSON,
      fiveYearAggregatesJSON,
    ] = await Promise.all([
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${oneDay}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneWeek}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/hour/${oneMonth}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/day/${threeMonth}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/month/${oneYear}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/1/month/${fiveYear}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      ),
    ]);

    let [
      oneDayAggregates,
      oneWeekAggregates,
      oneMonthAggregates,
      threeMonthAggregates,
      oneYearAggregates,
      fiveYearAggregates,
    ] = await Promise.all([
      oneDayAggregatesJSON.json(),
      oneWeekAggregatesJSON.json(),
      oneMonthAggregatesJSON.json(),
      threeMonthAggregatesJSON.json(),
      oneYearAggregatesJSON.json(),
      fiveYearAggregatesJSON.json(),
    ]);

    // !! need to account for weekends and holidays
    if (oneDayAggregates.status === "DELAYED") {

      const yesterdayDay = getDate(1);

      const yesterdaysAggregatesJSON = await fetch(
        `https://api.polygon.io/v2/aggs/ticker/${stockSymbol}/range/5/minute/${yesterdayDay}/${todaysDate}?adjusted=true&sort=asc&apiKey=${process.env.STOCK_API_KEY2}`
      );

      const yesterdaysAggregates = await yesterdaysAggregatesJSON.json();

      oneDayAggregates = yesterdaysAggregates;
    }


    const [stockDetailsJSON, stockSnapshotJSON, stockNewsJSON] =
      await Promise.all([
        fetch(
          `https://api.polygon.io/v3/reference/tickers/${stockSymbol}?apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v3/snapshot?ticker.any_of=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
        fetch(
          `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
        ),
      ]);

    const [stockDetails, stockSnapshot, stockNews] = await Promise.all([
      stockDetailsJSON.json(),
      stockSnapshotJSON.json(),
      stockNewsJSON.json(),
    ]);

    const {
      id = null,
      stockName: name = "-",
      stockSymbol: symbol = "-",
    } = stock ?? {};

    const {
      market_cap = 0,
      address: { city = "-", state = "-" } = {},
      description = "-",
      total_employees: employees = 0,
      sic_description: industry = "-",
    } = stockDetails?.results ?? {};

    const {
      market_status = "-",
      session: {
        price = 0,
        change = 0,
        change_percent = 0,
        regular_trading_change = 0,
        regular_trading_change_percent = 0,
        early_trading_change = 0,
        early_trading_change_percent = 0,
        late_trading_change = 0,
        late_trading_change_percent = 0,
        high = 0,
        low = 0,
        open = 0,
        close = 0,
        volume = 0,
      } = {},
    } = stockSnapshot.results[0] ?? {};

    const stockData = {
      id,
      name,
      symbol,
      price,
      change,
      change_percent,
      market_status,
      regular_trading_change,
      regular_trading_change_percent,
      early_trading_change,
      early_trading_change_percent,
      late_trading_change,
      late_trading_change_percent,
      description,
      employees,
      industry,
      headquarters: `${city},${state}`,
      market_cap,
      high,
      low,
      open,
      close,
      volume,
      news: stockNews?.results ?? [],
      listIds: stock.StockLists.map((stock) => stock.id),
      oneDayAggregates: oneDayAggregates.results,
      oneWeekAggregates: oneWeekAggregates.results,
      oneMonthAggregates: oneMonthAggregates.results,
      threeMonthAggregates: threeMonthAggregates.results,
      oneYearAggregates: oneYearAggregates.results,
      fiveYearAggregates: fiveYearAggregates.results,
    };


    // const stockSharesTracker = {};

      // let currentTransactionGroup5min = {};
      // for (let transaction of userTransactions) {
      //   let {
      //     purchaseDate,
      //     transactionType,
      //     quantity,
      //     purchasePrice,
      //     stockName,
      //     stockSymbol,
      //   } = transaction;

      //   // const roundedToHourUnix = roundToNearestIntervalInUnix(purchaseDate, 5);
      //   // const roundedToDayUnix = roundToNearestIntervalInUnix(purchaseDate, 5);
      //   const roundedTo5minUnix = roundToNearestIntervalInUnix(purchaseDate, 5); //1740173400000

      //   // ! check if stock is shares track
      //   if (!stockSharesTracker[stockSymbol]) {
      //     stockSharesTracker[stockSymbol] = {
      //       stockSymbol,
      //       stockName,
      //       totalShares: 0,
      //     };
      //   }

      //   console.log('ENTERING', stockSharesTracker[stockSymbol])

      //   // * check if timestamp exists in object

      //   if (!currentTransactionGroup5min[roundedTo5minUnix]) {
      //     // ! update stock shares

      //       if (transactionType === "buy") {
      //         console.log('buy updating shares', stockSharesTracker[stockSymbol].totalShares, '+', quantity)
      //         stockSharesTracker[stockSymbol].totalShares += quantity;
      //       } else {
      //         console.log('sell updating shares', stockSharesTracker[stockSymbol].totalShares, '-', quantity)
      //         stockSharesTracker[stockSymbol].totalShares -= quantity;
      //       }


      //     // * if timestamp doesnt exists add it
      //     currentTransactionGroup5min[roundedTo5minUnix] = {};

      //     // * check if stock symbol is in object
      //     if (!currentTransactionGroup5min[roundedTo5minUnix][stockSymbol]) {
      //       // * if stock symbol doesnt exists, add it

      //       currentTransactionGroup5min[roundedTo5minUnix][stockSymbol] = {
      //         stockName,
      //         stockSymbol,
      //         quantity,
      //         purchaseDate,
      //         transactionType,
      //       };
      //     }
      //     // * IF TIME FRAME DOESNT EXISTS, A STOCK SYMBOL CAN ONLY BE ADDED AS IF ITS THE SAME TIME FRAME IT WILL HIT THE ELSE
      //   } else {
      //     // * if timestamp already exists
      //     // ! update stock shares

      //       if (transactionType === "buy") {
      //         console.log('buy updating shares', stockSharesTracker[stockSymbol].totalShares, '+', quantity)
      //         stockSharesTracker[stockSymbol].totalShares += quantity;
      //       } else {
      //         console.log('sell updating shares', stockSharesTracker[stockSymbol].totalShares, '-', quantity)
      //         stockSharesTracker[stockSymbol].totalShares -= quantity;
      //       }


      //     // * check if symbol is in timestamp
      //     if (!currentTransactionGroup5min[roundedTo5minUnix][stockSymbol]) {
      //       // * stock symbol doest exists in this time frame

      //       currentTransactionGroup5min[roundedTo5minUnix][stockSymbol] = {
      //         stockName,
      //         stockSymbol,
      //         quantity,
      //         purchaseDate,
      //         transactionType,
      //       };
      //     }

      //     console.log(stockSharesTracker);
      //   }
      // }

      // console.log("====");
      // console.log(currentTransactionGroup5min);


       // const firstTransaction = await StockUserTransaction.findOne({
  //   where: { userId: id },
  //   include: [{ model: Stock, attributes: ["id", "stockSymbol", "stockName"] }],
  //   order: [["createdAt", "ASC"]], // Order by creation date in ascending order (oldest first)
  // });

  // console.log(firstTransaction);
  // console.log(firstTransaction.purchaseDate); // 2025-02-21T21:30:40.950Z

  // const firstTransactionDate = new Date(firstTransaction.purchaseDate);
  // const unixTimestamp = firstTransactionDate.getTime();
  // // console.log(" unixTimestamp:", unixTimestamp); // 1740173440950
