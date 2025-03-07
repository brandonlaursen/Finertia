import "./TransferModalAmountInput.css";

function TransferModalAmountInput({ showConfirmation, amount, setAmount }) {
  return (
    <div className="TransferModalAmountInput">
      <span className="TransferModalAmountInput__title">Amount</span>

      <div
        className={`TransferModalAmountInput__input-container ${
          showConfirmation && "TransferModalAmountInput--input-disabled"
        }`}
      >
        <span className="TransferModalAmountInput__dollar-sign">$</span>
        <input
          type="number"
          pattern="[0-9]*"
          className="TransferModalAmountInput__amount-input"
          value={amount || ""}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          placeholder={0}
          disabled={showConfirmation}
        />
      </div>
    </div>
  );
}

export default TransferModalAmountInput;
