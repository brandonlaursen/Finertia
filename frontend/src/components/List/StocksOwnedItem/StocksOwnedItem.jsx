import TinyChart from "../TinyChart/TinyChart";

function StocksOwnedItem({ stock, navigate, stocks }) {
  const { symbol, sharesOwned } = stock;

  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  const { o, h, c } = stockInfo.day;

  return (
    <article
      className="StockListItem"
      key={stockInfo?.id}
      onClick={() => navigate(`/stocks/${stockInfo?.symbol}`)}
    >
      <section className="StockListItem__details">
        <span>{stockInfo?.symbol}</span>
        <span className="StockListItem__details__shares">
          {sharesOwned ? `${sharesOwned?.toFixed(5)} Shares` : ""}
        </span>
      </section>

      <TinyChart o={o} h={h} c={c} />

      <section className="StockListItem__stats">
        <span>${stockInfo?.current_price.toFixed(2)}</span>
        <span
          className={`${
            stockInfo?.todays_change_percent.toFixed(2) > 0
              ? "StockListItem__percent-change-green"
              : "StockListItem__percent-change-red"
          }`}
        >
          {stockInfo?.todays_change_percent.toFixed(2) > 0 && "+"}
          {stockInfo?.todays_change_percent.toFixed(2)}%
        </span>
      </section>
    </article>
  );
}

export default StocksOwnedItem;
