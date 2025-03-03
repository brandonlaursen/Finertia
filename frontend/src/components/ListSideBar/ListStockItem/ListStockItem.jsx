import './ListStockItem.css'

import TinyChart from "../../TinyChart/TinyChart";


function ListStockItem({ stock, stocks, navigate }) {
  const { symbol = stock.stockSymbol, sharesOwned } = stock;

  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  const { o, h, c } = stockInfo.day;
  const { id, current_price, todays_change_percent } = stockInfo;

  return (
    <article
      className="ListStockItem"
      key={id}
      onClick={() => navigate(`/stocks/${symbol}`)}
    >
      <section className="ListStockItem__details">
        <span>{symbol}</span>
        <span className="ListStockItem__details__shares">
          {sharesOwned ? `${sharesOwned?.toFixed(5)} Shares` : ""}
        </span>
      </section>

      <TinyChart o={o} h={h} c={c} />

      <section className="ListStockItem__stats">
        <span> ${current_price.toFixed(2)}</span>
        <span
          className={`${
            todays_change_percent.toFixed(2) > 0
              ? "ListStockItem__percent-change-green"
              : "ListStockItem__percent-change-red"
          }`}
        >
          {todays_change_percent.toFixed(2) > 0 && "+"}
          {todays_change_percent.toFixed(2)}%
        </span>
      </section>
    </article>
  );
}

export default ListStockItem;
