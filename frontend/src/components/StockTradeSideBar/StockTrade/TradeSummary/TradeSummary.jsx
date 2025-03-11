import "./TradeSummary.css";
import { MdInfoOutline } from "react-icons/md";

function TradeSummary({
  tradeUnit,
  tradeType,
  tradeCostEstimate,
  tradeSharesEstimate,
  showReview,
  errors,
  messages,
}) {
  return (
    <>
      <div className="TradeSummary">
        {tradeUnit === "Dollars" ? (
          <>
            <span>Estimated Quantity</span>
            <span className="TradeSummary__estimate">
              {tradeSharesEstimate && Number(tradeSharesEstimate).toFixed(5)}
            </span>
          </>
        ) : (
          <>
            {tradeType === "buy" ? (
              <span>Estimated Cost</span>
            ) : (
              <span>Estimated Credit</span>
            )}

            <span className="TradeSummary__estimate">
              ${Number(tradeCostEstimate).toFixed(2)}
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
          {messages && !errors && (
            <div className="TradeSummary__errors">
              <span className="TradeSummary__title">
                <MdInfoOutline className="TradeSummary__error-icon" />
                {messages[0]}
              </span>
              <span className="TradeSummary__error-message">{messages[1]}</span>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default TradeSummary;
