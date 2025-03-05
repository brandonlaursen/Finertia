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
      {(!reviewingTrade || tradeType === "buy") && (
        <div
          className={`TradeType_select ${
            tradeType === "buy" && "TradeType--selected"
          } ${reviewingTrade ? "TradeType--disabled" : ""}`}
          onClick={() => handleTradeTypeChange("buy")}
        >
          Buy {stock.symbol}
        </div>
      )}
      {(!reviewingTrade || tradeType === "sell") && (
        <div
          className={`TradeType_select ${
            tradeType === "sell" && "TradeType--selected"
          } ${reviewingTrade ? "TradeType--disabled" : ""}`}
          onClick={() => handleTradeTypeChange("sell")}
        >
          Sell {stock.symbol}
        </div>
      )}
    </header>
  );
}

export default TradeType;
