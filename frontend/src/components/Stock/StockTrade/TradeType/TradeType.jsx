import "./TradeType.css";

function TradeType({
  stock,
  tradeType,
  setTradeType,
  setSharesToTrade,
  setTradeAmount,
  clearReview,
}) {
  const handleTradeTypeChange = (type) => {
    setTradeType(type);
    setSharesToTrade("");
    setTradeAmount("");
    clearReview();
  };

  return (
    <header className="TradeType">
      <div
        className={`TradeType_select  ${
          tradeType === "buy" && "TradeType--selected"
        }`}
        onClick={() => handleTradeTypeChange("buy")}
      >
        Buy {stock.symbol}
      </div>
      <div
        className={`TradeType_select  ${
          tradeType === "sell" && "TradeType--selected"
        }`}
        onClick={() => handleTradeTypeChange("sell")}
      >
        Sell {stock.symbol}
      </div>
    </header>
  );
}

export default TradeType;
