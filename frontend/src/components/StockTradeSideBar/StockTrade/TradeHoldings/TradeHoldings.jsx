import "./TradeHoldings.css";

function TradeHoldings({
  balance,
  sharesOwned,
  price,
  tradeUnit,
  tradeType,
  setTradeType,
  setTradeUnit,
  setSharesToTrade,
  stock,
}) {
  async function handleSellAllShares() {
    setTradeType("sell");
    setTradeUnit("Shares");
    setSharesToTrade(Number(sharesOwned).toFixed(5));
  }

  const validPrice = Number.isFinite(price) ? price : 0;
  const availableDollarAmount = Number.isFinite(sharesOwned)
    ? (Number(sharesOwned) * validPrice).toFixed(2)
    : "0.00";
  const availableShares = Number.isFinite(sharesOwned)
    ? Number(sharesOwned).toFixed(5)
    : "0.00000";

  return (
    <div className="TradeHoldings">
      {tradeType === "buy" ? (
        ` $${
          Number.isFinite(balance) ? balance.toFixed(2) : "0.00"
        } buying power available.`
      ) : (
        <div className="TradeHoldings__holdings">
          {tradeUnit === "Dollars" ? (
            <span>{`$${availableDollarAmount} Available - `}</span>
          ) : (
            <span>{`${availableShares} Share${
              Math.round(sharesOwned) > 1 ? "s" : ""
            } Available - `}</span>
          )}

          <button
            className={`TradeHoldings__holdings__sell-all-button ${
              stock.market_status === "closed" &&
              "TradeHoldings__holdings__sell-all-button--disabled"
            }`}
            onClick={handleSellAllShares}
            disabled={stock.market_status === "closed"}
          >
            Sell All
          </button>
        </div>
      )}
    </div>
  );
}
export default TradeHoldings;
