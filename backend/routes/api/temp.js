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
