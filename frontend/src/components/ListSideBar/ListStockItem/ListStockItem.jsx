import "./ListStockItem.css";

import TinyChart from "../../TinyChart/TinyChart";

import { useDispatch, useSelector } from "react-redux";
import { fetchStockForList } from "../../../../store/stocks";
import { useEffect } from "react";

function ListStockItem({ stock, stocks, navigate }) {
  const dispatch = useDispatch();

  const { symbol = stock.stockSymbol, sharesOwned } = stock;

  const listStocks = useSelector((state) => state.stocks.listStocks);

  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  useEffect(() => {
    async function fetchStockData() {
      await dispatch(fetchStockForList(symbol));
    }

    if (symbol) {
      fetchStockData();
    }
  }, [symbol, dispatch]);

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

      <TinyChart
        aggregates={listStocks[symbol]}
        todays_change_percent={todays_change_percent}
      />

      <section className="ListStockItem__stats">
        <span> ${current_price.toFixed(2)}</span>
        <span
          className={`${
            todays_change_percent.toFixed(2) > 0 ? "positive" : "negative"
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
