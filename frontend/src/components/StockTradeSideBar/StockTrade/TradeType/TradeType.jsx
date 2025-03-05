import "./TradeType.css";

function TradeType({
  stock,
  tradeType,
  setTradeType,
  setSharesToTrade,
  setTradeAmount,
  clearReview,
  reviewingTrade,
}) {
  const handleTradeTypeChange = (type) => {
    setTradeType(type);
    setSharesToTrade("");
    setTradeAmount("");
    clearReview();
  };

  return (
    <header className="TradeType">
      {!reviewingTrade && (
        <div
          className={`TradeType_select ${
            tradeType === "buy" && "TradeType--selected"
          }`}
          onClick={() => handleTradeTypeChange("buy")}
        >
          Buy {stock.symbol}
        </div>
      )}
      <div
        className={`TradeType_select ${
          tradeType === "sell" && "TradeType--selected"
        } ${
          reviewingTrade && tradeType === "buy" ? "TradeType--disabled" : ""
        }`}
        onClick={() => handleTradeTypeChange("sell")}
      >
        Sell {stock.symbol}
      </div>
    </header>
  );
}

export default TradeType;
