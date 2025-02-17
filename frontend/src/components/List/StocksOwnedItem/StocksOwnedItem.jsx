
function StocksOwnedItem({ stock, navigate, stocks }) {
  const { stockId, stockSymbol, sharesOwned } = stock;

  const stockInfo = stocks[stockId];
 
  return (
    <div
      className="WatchListStocks__container"
      key={stockId}
      onClick={() => navigate(`/stocks/${stockSymbol}`)}
    >
      <div className="WatchListStocks__container-title-shares">
        <span className="WatchListStocks__container-title">{stockSymbol}</span>
        <span className="WatchListStocks__container-subtitle">
          {sharesOwned.toFixed(2) ? `${sharesOwned.toFixed(2)} Shares` : ""}
        </span>
      </div>
      <span className="WatchListStocks__container-graph"></span>
      <span className="WatchListStocks__container-data">
        <span className={`WatchListStocks__container-price`}>
          ${stockInfo?.current_price.toFixed(2)}
        </span>
        <span
          className={`WatchListStocks__container-percent ${
            stockInfo?.todays_change_percent.toFixed(2) > 0
              ? "WatchListStocks__percent-green"
              : "WatchListStocks__percent-red"
          }`}
        >
          {stockInfo?.todays_change_percent.toFixed(2) > 0 && "+"}
          {stockInfo?.todays_change_percent.toFixed(2)}%
        </span>
      </span>
    </div>
  );
}

export default StocksOwnedItem;
