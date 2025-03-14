
async function fetchStockSnapshot(stockSymbol) {
  if (!stockSymbol) {
    throw new Error("Stock symbol is required.");
  }

  try {
    const [stockSnapshotResponse, stockNewsResponse] = await Promise.all([
      fetch(
        `https://api.polygon.io/v3/snapshot?ticker.any_of=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
      ),
      fetch(
        `https://api.polygon.io/v2/reference/news?ticker=${stockSymbol}&limit=10&apiKey=${process.env.STOCK_API_KEY2}`
      ),
    ]);

    const [stockSnapshotData, stockNewsData] = await Promise.all([
      stockSnapshotResponse.json(),
      stockNewsResponse.json(),
    ]);

    const snapshot = stockSnapshotData?.results?.length
      ? stockSnapshotData.results[0]
      : {};

    const { market_status = "-", session = {} } = snapshot;

    const {
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
    } = session;

    const stockNews = stockNewsData?.results ?? [];

    return {
      market_status,
      price,
      change,
      change_percent,
      regular_trading_change,
      regular_trading_change_percent,
      early_trading_change,
      early_trading_change_percent,
      late_trading_change,
      late_trading_change_percent,
      high,
      low,
      open,
      close,
      volume,
      stockNews,
    };
  } catch (error) {
    console.error("Error fetching stock snapshot:", error);
    throw error;
  }
}

module.exports = fetchStockSnapshot;
