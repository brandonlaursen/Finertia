import "./TradeType.css";

function TradeType({
  stock,
  transactionType,
  handleTransactionType,
  clearReview,
}) {
  return (
    <header className="TradeType">
      <div
        className={`TradeType_select  ${
          transactionType === "buy" && "TradeType--selected"
        }`}
        onClick={() => {
          handleTransactionType("buy"), clearReview();
        }}
      >
        Buy {stock.symbol}
      </div>
      <div
        className={`TradeType_select  ${
          transactionType === "sell" && "TradeType--selected"
        }`}
        onClick={() => {
          handleTransactionType("sell");
          clearReview();
        }}
      >
        Sell {stock.symbol}
      </div>
    </header>
  );
}

export default TradeType;
