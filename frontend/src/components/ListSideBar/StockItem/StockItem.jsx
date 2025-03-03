import TinyChart from "../TinyChart/TinyChart";


function StockItem({ stock, stocks, navigate }) {
  const { symbol = stock.stockSymbol, sharesOwned } = stock;

  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  const { o, h, c } = stockInfo.day;
  const { id, current_price, todays_change_percent } = stockInfo;

  return (
    <article
      className="StockListItem"
      key={id}
      onClick={() => navigate(`/stocks/${symbol}`)}
    >
      <section className="StockListItem__details">
        <span>{symbol}</span>
        <span className="StockListItem__details__shares">
          {sharesOwned ? `${sharesOwned?.toFixed(5)} Shares` : ""}
        </span>
      </section>

      <TinyChart o={o} h={h} c={c} />

      <section className="StockListItem__stats">
        <span> ${current_price.toFixed(2)}</span>
        <span
          className={`${
            todays_change_percent.toFixed(2) > 0
              ? "StockListItem__percent-change-green"
              : "StockListItem__percent-change-red"
          }`}
        >
          {todays_change_percent.toFixed(2) > 0 && "+"}
          {todays_change_percent.toFixed(2)}%
        </span>
      </section>
    </article>
  );
}

export default StockItem;
