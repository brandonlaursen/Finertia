import "./StockTradeEstimate.css";

function StockTradeEstimate({
  buyIn,
  estimatedShares,
  transactionType,
  estimatedCost,
  showReview,
  setShowReview,
  errors,
  setErrors,
  handleStockTransaction,
}) {
  return (
    <>
      <div className="StockTransaction__estimate">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="StockTransaction__estimate-amount">
              {Number(estimatedShares).toFixed(2)}
            </span>
          </>
        ) : (
          <>
            {transactionType === "buy " ? (
              <span>Estimated Cost</span>
            ) : (
              <span>Estimated Credit</span>
            )}

            <span className="StockTransaction__estimate-amount">
              ${Number(estimatedCost).toFixed(2)}
            </span>
          </>
        )}
      </div>
      {showReview && (
        <>
          <div className="StockTransaction__review-container">Review</div>
          {errors && <span>{errors}</span>}
        </>
      )}
      <div className="StockTransaction__button-container">
        {showReview && errors && (
          <button
            className="StockTransaction__button"
            onClick={() => {
              setShowReview(false), setErrors(null);
            }}
            // onClick={handleStockTransaction}
          >
            Cancel
          </button>
        )}

        {!showReview && (
          <button
            className="StockTransaction__button"
            onClick={handleStockTransaction}
            // onClick={handleStockTransaction}
          >
            Review Order
          </button>
        )}
      </div>
    </>
  );
}

export default StockTradeEstimate;
