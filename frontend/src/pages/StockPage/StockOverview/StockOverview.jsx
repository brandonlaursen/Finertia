import "./StockOverview.css";

function StockOverview({ stock }) {
  const {
    name,
    price,
    regular_trading_change,
    regular_trading_change_percent,
    market_status,
    late_trading_change,
    late_trading_change_percent,
  } = stock;

  return (
    <div className="StockOverview">
      <h1 className="StockOverview__name">{name}</h1>
      <span className="StockOverview__price">${price.toFixed(2)}</span>

      <section className="StockOverview__section">
        <span
          className={`StockOverview__change ${
            regular_trading_change < 0 ? "negative" : regular_trading_change > 0
          }`}
        >
          {regular_trading_change < 0 ? "" : "+"}${regular_trading_change}
          <span
            className={`StockOverview__change ${
              regular_trading_change_percent < 0
                ? "negative"
                : regular_trading_change_percent > 0
            }`}
          >
            {` (${regular_trading_change_percent < 0 ? "" : "+"}${regular_trading_change_percent?.toFixed(2)}%)`}
          </span>
        </span>
        <span className="StockOverview__day">Today</span>
      </section>

      {market_status === "closed" ? (
        <section className="StockOverview__section">
          <span
            className={`StockOverview__change  ${
              late_trading_change < 0 ? "negative" : late_trading_change > 0
            }`}
          >
            {`$${late_trading_change} (${late_trading_change_percent?.toFixed(
              2
            )}%)`}
          </span>
          <span className="StockOverview__market-hours">Overnight</span>
        </section>
      ) : (
        <section className="StockOverview__market-hours">
          24 Hour Market
        </section>
      )}
    </div>
  );
}

export default StockOverview;
