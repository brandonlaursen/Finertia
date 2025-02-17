import "./BuyInDropdown.css";
import { GrFormCheckmark } from "react-icons/gr";

function BuyInDropdown({ buyIn, setBuyIn }) {
  return (
    <div className={`BuyInDropdown`}>
      <div
        className={`BuyInDropdown-option ${
          buyIn === "Dollars" && "BuyInDropdown-option-hover"
        }`}
      >
        <div className="checkmark-div">
          {buyIn === "Dollars" && (
            <GrFormCheckmark className="TransferModal__checkmark" />
          )}
        </div>

        <span onClick={() => setBuyIn("Dollars")}>Dollars</span>
      </div>
      <div
        className={`BuyInDropdown-option ${
          buyIn === "Shares" && "BuyInDropdown-option-hover"
        }`}
      >
        <div className="checkmark-div">
          {buyIn === "Shares" && (
            <GrFormCheckmark className="TransferModal__checkmark" />
          )}
        </div>

        <span onClick={() => setBuyIn("Shares")}>Shares</span>
      </div>
    </div>
  );
}

export default BuyInDropdown;
