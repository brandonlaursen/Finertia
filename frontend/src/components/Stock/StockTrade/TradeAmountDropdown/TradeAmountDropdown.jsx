import "./TradeAmountDropdown.css";
import { GrFormCheckmark } from "react-icons/gr";

function TradeAmountDropdown({ tradeUnit, setTradeUnit, clearReview }) {
  return (
    <div className="TradeAmountDropdown">
      <section
        className={`TradeAmountDropdown__option ${
          tradeUnit === "Dollars" && "TradeAmountDropdown__option--hover"
        }`}
      >
        <div className="TradeAmountDropdown__check-mark">
          {tradeUnit === "Dollars" && (
            <GrFormCheckmark className="TradeAmountDropdown__check-mark-icon" />
          )}
        </div>

        <span
          onClick={() => {
            setTradeUnit("Dollars"), clearReview();
          }}
        >
          Dollars
        </span>
      </section>
      <section
        className={`TradeAmountDropdown__option ${
          tradeUnit === "Shares" && "TradeAmountDropdown__option--hover"
        }`}
      >
        <div className="TradeAmountDropdown__check-mark">
          {tradeUnit === "Shares" && (
            <GrFormCheckmark className="TradeAmountDropdown__check-mark-icon" />
          )}
        </div>

        <span
          onClick={() => {
            setTradeUnit("Shares"), clearReview();
          }}
        >
          Shares
        </span>
      </section>
    </div>
  );
}

export default TradeAmountDropdown;
