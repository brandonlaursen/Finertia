import "./TradeHoldings.css";

function TradeHoldings({
  balance,
  sharesOwned,
  price,
  tradeUnit,
  tradeType,
  setTradeType,
  setTradeUnit,
  setSharesToTrade
}) {

  async function handleSellAllShares() {
    setTradeType("sell");
    setTradeUnit("Shares");
    setSharesToTrade(Number(sharesOwned).toFixed(5));
  }
  return (
    <div className="TradeHoldings">
      {tradeType === "buy" ? (
        ` $${balance.toFixed(2)} buying power available`
      ) : (
        <div className="TradeHoldings__holdings">
          {tradeUnit === "Dollars" ? (
            <span>{`$${(Number(sharesOwned) * price).toFixed(
              2
            )} Available - `}</span>
          ) : (
            <span>{`${Number(sharesOwned).toFixed(5)} Share${
              Math.round(sharesOwned) > 1 ? "s" : ""
            } Available - `}</span>
          )}

          <button
            className="TradeHoldings__holdings__sell-all-button"
            onClick={handleSellAllShares}
          >
            Sell All
          </button>
        </div>
      )}
    </div>
  );
}

export default TradeHoldings;
