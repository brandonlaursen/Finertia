import "./TradeSummary.css";
import { MdInfoOutline } from "react-icons/md";

function TradeSummary({
  buyIn,
  estimatedShares,
  transactionType,
  estimatedCost,
  showReview,
  errors,
  message,
}) {
  return (
    <>
      <div className="TradeSummary">
        {buyIn === "Dollars" ? (
          <>
            <span>Est.Quantity</span>
            <span className="TradeSummary__estimate">
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

            <span className="TradeSummary__estimate">
              ${Number(estimatedCost).toFixed(2)}
            </span>
          </>
        )}
      </div>
      {showReview && (
        <>
          {errors && (
            <div className="TradeSummary__errors">
              <span className="TradeSummary__title">
                <MdInfoOutline className="TradeSummary__error-icon" />
                {errors[0]}
              </span>
              <span className="TradeSummary__error-message">{errors[1]}</span>
            </div>
          )}
          {message && (
            <div className="TradeSummary__messages">
              <span className="TradeSummary__message">{message}</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default TradeSummary;
