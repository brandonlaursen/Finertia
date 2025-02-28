import "./TradeAmountDropdown.css";
import { GrFormCheckmark } from "react-icons/gr";

function TradeAmountDropdown({ buyIn, setBuyIn, clearReview }) {
  return (
    <div className="TradeAmountDropdown">
      <section
        className={`TradeAmountDropdown__option ${
          buyIn === "Dollars" && "TradeAmountDropdown__option--hover"
        }`}
      >
        <div className="TradeAmountDropdown__check-mark">
          {buyIn === "Dollars" && (
            <GrFormCheckmark className="TradeAmountDropdown__check-mark-icon" />
          )}
        </div>

        <span
          onClick={() => {
            setBuyIn("Dollars"), clearReview();
          }}
        >
          Dollars
        </span>
      </section>
      <section
        className={`TradeAmountDropdown__option ${
          buyIn === "Shares" && "TradeAmountDropdown__option--hover"
        }`}
      >
        <div className="TradeAmountDropdown__check-mark">
          {buyIn === "Shares" && (
            <GrFormCheckmark className="TradeAmountDropdown__check-mark-icon" />
          )}
        </div>

        <span
          onClick={() => {
            setBuyIn("Shares"), clearReview();
          }}
        >
          Shares
        </span>
      </section>
    </div>
  );
}

export default TradeAmountDropdown;
