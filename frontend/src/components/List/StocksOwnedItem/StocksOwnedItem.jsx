import "./StocksOwnedItem.css";

function StocksOwnedItem({ stock, navigate, stocks }) {
  const { symbol, sharesOwned } = stock;

  console.log("asdfasdfsadf", stock);
  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  return (
    <div
      className="WatchListStocks__container"
      key={stockInfo?.id}
      onClick={() => navigate(`/stocks/${stockInfo?.symbol}`)}
    >
      <div className="WatchListStocks__container-title-shares">
        <span className="WatchListStocks__container-title">
          {stockInfo?.symbol}
        </span>
        <span className="StocksOwnedItem__container-subtitle">
          {sharesOwned?.toFixed(5) ? `${sharesOwned?.toFixed(5)} Shares` : ""}
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
