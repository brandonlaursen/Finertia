import "./StockTransactionOrder.css";

function StockTransactionOrder({
  buyIn,
  tradeAmount,
  handleTradeAmountChange,
  sharesToTrade,
  handleTradeSharesChange,
  price,
}) {
  return (
    <>
      <div className="StockTransaction__order-section">
        {buyIn === "Dollars" ? (
          <>
            <div className="StockTransaction__order-section__text">
              <span>Amount</span>
            </div>

            <div className={`StockTransaction__input-wrapper`}>
              <span className="StockTransaction__dollar-sign">$</span>
              <input
                type="number"
                pattern="[0-9]*"
                value={tradeAmount || ''}
                placeholder="0.0"
                className="StockTransaction__amount-input"
                onChange={handleTradeAmountChange}
              />
            </div>
          </>
        ) : (
          <>
            <div className="StockTransaction__order-section__text">
              <span>Shares</span>
            </div>
            <div className={`StockTransaction__input-wrapper`}>
              <input
                type="number"
                pattern="[0-9]*"
                value={sharesToTrade || ''}
                placeholder="0"
                className="StockTransaction__amount-input"
                onChange={handleTradeSharesChange}
              />
            </div>
          </>
        )}
      </div>
      {buyIn === "Shares" && (
        <div className="StockTransaction__market-price">
          <span className="StockTransaction__market-price-title">
            Market Price
          </span>
          <span>${price.toFixed(2)}</span>
        </div>
      )}
      <div className="StockTransaction__line"></div>
    </>
  );
}

export default StockTransactionOrder;
