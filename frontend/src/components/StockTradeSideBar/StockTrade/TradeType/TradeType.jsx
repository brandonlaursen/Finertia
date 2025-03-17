import "./TradeType.css";
import { MdClose } from "react-icons/md";

function TradeType({
  stock,
  tradeType,
  setTradeType,
  setSharesToTrade,
  setTradeAmount,
  clearReview,
  reviewingTrade,
  showStockTradeSideBar,
  setShowStockTradeSideBar,
}) {
  function handleTradeTypeChange(type) {
    setTradeType(type);
    setSharesToTrade("");
    setTradeAmount("");
    clearReview();
  }

  function closeMobileTradeSideBar() {
    setShowStockTradeSideBar(false);
    setSharesToTrade("");
    setTradeAmount("");
    clearReview();
  }

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

      {showStockTradeSideBar && (
        <button className="TradeType__close-button">
          <MdClose
            className="TradeType__close-button-icon"
            onClick={closeMobileTradeSideBar}
          />
        </button>
      )}
    </header>
  );
}

export default TradeType;
