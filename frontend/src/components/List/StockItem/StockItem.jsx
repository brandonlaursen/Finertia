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
    <article
      className="StockListItem"
      key={id}
      onClick={() => navigate(`/stocks/${stockSymbol}`)}
    >
      <section className="StockListItem__details">
        <span>{stockSymbol}</span>
        <span></span>
      </section>

      <TinyChart o={o} h={h} c={c} />

      <section className="StockListItem__stats">
        <span> ${currentPrice.toFixed(2)}</span>
        <span
          className={`${
            todaysPriceChange.toFixed(2) > 0
              ? "StockListItem__percent-change-green"
              : "StockListItem__percent-change-red"
          }`}
        >
          {todaysPriceChange.toFixed(2) > 0 && "+"}
          {todaysPriceChange.toFixed(2)}%
        </span>
      </section>
    </article>
  );
}

export default StockItem;
