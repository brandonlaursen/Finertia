import "./StockTransactionFooter.css";

function StockTransactionFooter({
  transactionType,
  balance,
  buyIn,
  sharesOwned,
  price,
  handleSellAll,
}) {
  return (
    <div className="StockTransaction_footer">
      {transactionType === "buy" ? (
        ` $${balance.toFixed(2)} buying power available`
      ) : (
        <div className="StockTransaction_footer-sell">
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
          <span
            className="StockTransaction_footer-text"
            onClick={handleSellAll}
          >
            Sell All
          </span>
        </div>
      )}
    </div>
  );
}

export default StockTransactionFooter;
