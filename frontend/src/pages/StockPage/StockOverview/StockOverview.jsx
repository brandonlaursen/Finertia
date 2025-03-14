import "./StockOverview.css";

function StockOverview({ stock, selectedTimeFrame }) {
  const {
    name,
    price,
    regular_trading_change,
    regular_trading_change_percent,
    market_status,
    late_trading_change,
    late_trading_change_percent,
  } = stock;

  const formattedPrice = Number.isFinite(price) ? `$${price.toFixed(2)}` : "-";

  const formattedChangePercent = Number.isFinite(regular_trading_change_percent)
    ? ` (${
        regular_trading_change_percent <= 0 ? "" : "+"
      }${regular_trading_change_percent.toFixed(2)}%)`
    : "-";

  const formattedLateTradingChange = Number.isFinite(late_trading_change)
    ? `$${late_trading_change}`
    : "-";
  const formattedLateTradingChangePercent = Number.isFinite(
    late_trading_change_percent
  )
    ? `(${late_trading_change_percent.toFixed(2)}%)`
    : "";
  const finalLateTradingText =
    formattedLateTradingChange !== "-"
      ? `${formattedLateTradingChange} ${formattedLateTradingChangePercent}`
      : "-";

  return (
    <div className="StockOverview">
      <h1 className="StockOverview__name">{name}</h1>
      <span className="StockOverview__price">{formattedPrice}</span>

      <section className="StockOverview__section">
        <span
          className={`StockOverview__change ${
            regular_trading_change < 0
              ? "negative"
              : regular_trading_change > 0
              ? "positive"
              : ""
          }`}
        >
          ${regular_trading_change < 0 ? "" : "+"}
          {regular_trading_change}
          <span
            className={`StockOverview__change ${
              regular_trading_change_percent < 0
                ? "negative"
                : regular_trading_change_percent > 0
                ? "positive"
                : ""
            }`}
          >
            {formattedChangePercent}
          </span>
        </span>
        <span className="StockOverview__day">
          {selectedTimeFrame === "1D"
            ? "Today"
            : selectedTimeFrame === "1W"
            ? "Past week"
            : selectedTimeFrame === "1M"
            ? "Past month"
            : selectedTimeFrame === "3M"
            ? "Past 3 months"
            : selectedTimeFrame === "1Y"
            ? "Past year"
            : selectedTimeFrame === "5Y"
            ? "Past 5 years"
            : "This year"}
        </span>
      </section>

      {market_status === "late_trading" ? (
        <section className="StockOverview__section">
          <span
            className={`StockOverview__change ${
              late_trading_change < 0
                ? "negative"
                : late_trading_change > 0
                ? "positive"
                : ""
            }`}
          >
            {finalLateTradingText}
          </span>

          <span className="StockOverview__market-hours">After-Hours</span>
        </section>
      ) : (
        <section className="StockOverview__market-hours">
          {selectedTimeFrame === "1D" ? `Regular Trading Hours` : ""}
        </section>
      )}
    </div>
  );
}

export default StockOverview;
