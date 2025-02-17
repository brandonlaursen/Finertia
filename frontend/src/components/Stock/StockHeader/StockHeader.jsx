import "./StockHeader.css";

function StockHeader({ stock }) {
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
    <>
      <span className="StockPage__main-name">{name}</span>
      <span className="StockPage__main-price">${price.toFixed(2)}</span>
      <span className="StockPage__main-StockPage__main-price-change-today">
        <span
          className={`StockPage__main-price-change ${
            regular_trading_change < 0
              ? "negative"
              : regular_trading_change > 0
              ? "positive"
              : ""
          }`}
        >
          ${regular_trading_change}
        </span>

        <span
          className={`StockPage__main-price-change  ${
            regular_trading_change_percent < 0
              ? "negative"
              : regular_trading_change_percent > 0
              ? "positive"
              : ""
          }`}
        >
          {`(${regular_trading_change_percent?.toFixed(2)}%)`}
        </span>
        <span>Today</span>
      </span>
      {market_status === "closed" ? (
        <span className="StockPage__main-price-change-today">
          <span
            className={`StockPage__main-price-change  ${
              late_trading_change < 0
                ? "negative"
                : late_trading_change > 0
                ? "positive"
                : ""
            }`}
          >
            {`$${late_trading_change}
    (${late_trading_change_percent?.toFixed(2)}%)`}
          </span>
          <span>Overnight</span>
        </span>
      ) : (
        <span className="StockPage__main-price-change-overnight">
          24 Hour Market
        </span>
      )}
    </>
  );
}

export default StockHeader;
