import "./StockTradeEstimate.css";
import { MdInfoOutline } from "react-icons/md";

import { useState } from "react";

function StockTradeEstimate({
  buyIn,
  estimatedShares,
  transactionType,
  estimatedCost,
  showReview,
  errors,
  handleStockTransaction,
  message,
  clearReview
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmitDelay() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    handleStockTransaction();
  }

  // async function handleSubmitOrder() {}

  return (
    <>
      <div className="StockTransaction__estimate">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="StockTransaction__estimate-amount">
              {Number(estimatedShares).toFixed(5)}
            </span>
          </>
        ) : (
          <>
            {transactionType === "buy" ? (
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
          {errors && (
            <div className="StockTradeEstimate__errors">
              <span className="StockTradeEstimate__error">
                <MdInfoOutline />
                {errors[0]}
              </span>
              <span className="StockTradeEstimate__error-subtext">
                {errors[1]}
              </span>
            </div>
          )}
          {message && (
            <div className="StockTradeEstimate__errors">
              <span className="StockTradeEstimate__message">{message}</span>
            </div>
          )}
        </>
      )}
      <div className="StockTransaction__button-container">
        {showReview && errors && (
          <button
            className="StockTransaction__button"
            onClick={() => {
              clearReview()
            }}
          >
            Dismiss
          </button>
        )}

        {showReview && !errors && (
          <div className="StockTransaction__confirm-container">
            <button
              className="StockTransaction__button"
              onClick={() => {
                // setShowReview(false), setErrors(null);
              }}
            >
              Submit Order
            </button>
            <button
              className="StockTransaction__button"
              onClick={() => {
                clearReview()
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {!showReview && (
          <button
            className="StockTransaction__button"
            onClick={handleSubmitDelay}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              "Review Order"
            )}
          </button>
        )}
      </div>
    </>
  );
}

export default StockTradeEstimate;
