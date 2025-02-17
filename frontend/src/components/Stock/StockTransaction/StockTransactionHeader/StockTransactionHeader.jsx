import "./StockTransactionHeader.css";

function StockTransactionHeader({
  stock,
  transactionType,
  handleTransactionType,
  clearReview,
}) {
  return (
    <div className="StockTransaction__header">
      <div
        className={`StockTransaction__header-buy  ${
          transactionType === "buy" && "StockTransaction__header-selected"
        }`}
        onClick={() => {
          handleTransactionType("buy"), clearReview();
        }}
      >
        Buy {stock.symbol}
      </div>
      <div
        className={`StockTransaction__header-buy  ${
          transactionType === "sell" && "StockTransaction__header-selected"
        }`}
        onClick={() => {
          handleTransactionType("sell");
          clearReview();
        }}
      >
        Sell {stock.symbol}
      </div>
    </div>
  );
}

export default StockTransactionHeader;
