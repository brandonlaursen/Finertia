import "./TradeHoldings.css";

function TradeHoldings({
  transactionType,
  balance,
  buyIn,
  sharesOwned,
  price,
  handleSellAll,
}) {
  return (
    <div className="TradeHoldings">
      {transactionType === "buy" ? (
        ` $${balance.toFixed(2)} buying power available`
      ) : (
        <div className="TradeHoldings__holdings">
          {buyIn === "Dollars" ? (
            <span>{`$${(Number(sharesOwned) * price).toFixed(
              2
            )} Available`}</span>
          ) : (
            <span>{`${Number(sharesOwned).toFixed(5)} Share${
              Math.round(sharesOwned) > 1 ? "s" : ""
            } Available`}</span>
          )}
          -
          <button
            className="TradeHoldings__holdings__sell-all-button"
            onClick={handleSellAll}
          >
            Sell All
          </button>
        </div>
      )}
    </div>
  );
}

export default TradeHoldings;
