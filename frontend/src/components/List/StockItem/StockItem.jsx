import "./StockItem.css";
import TinyChart from "../TinyChart/TinyChart";
function StockItem({ stock, stocks, navigate }) {

  const { id, stockSymbol } = stock;

  const currentPrice = stocks[id].current_price;
  const todaysPriceChange = stocks[id].todays_change_percent;

  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === stockSymbol
  );

  const { o, h, c } = stockInfo.day;



  return (
    <div
      className="WatchListStocks__container"
      key={id}
      onClick={() => navigate(`/stocks/${stockSymbol}`)}
    >
      <div className="WatchListStocks__container-title-shares">
        <span className="WatchListStocks__container-title">{stockSymbol}</span>
        <span className="WatchListStocks__container-subtitle">
          {'     '}
        </span>
      </div>
      <TinyChart o={o} h={h} c={c} />
      <span className="WatchListStocks__container-data">
        <span className={`WatchListStocks__container-price`}>
          ${currentPrice.toFixed(2)}
        </span>
        <span
          className={`WatchListStocks__container-percent ${
            todaysPriceChange.toFixed(2) > 0
              ? "WatchListStocks__percent-green"
              : "WatchListStocks__percent-red"
          }`}
        >
          {todaysPriceChange.toFixed(2) > 0 && "+"}
          {todaysPriceChange.toFixed(2)}%
        </span>
      </span>
    </div>
  );
}

export default StockItem;
