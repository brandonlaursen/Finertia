import "./MoneyButtons.css";

function MoneyButtons({ showMoneyButtons, setShowMoneyButtons, setAmount }) {
  if (!showMoneyButtons) return null;

  return (
    <div className="MoneyButtons">
      <div className="MoneyButtons__buttons">
        <button
          className="TransferModal__amount"
          onClick={() => {
            setShowMoneyButtons(false), setAmount(100);
          }}
        >
          $100
        </button>
        <button
          className="MoneyButtons__button"
          onClick={() => {
            setShowMoneyButtons(false), setAmount(300);
          }}
        >
          $300
        </button>
        <button
          className="MoneyButtons__button"
          onClick={() => {
            setShowMoneyButtons(false), setAmount(1000);
          }}
        >
          $1,000
        </button>
      </div>
    </div>
  );
}

export default MoneyButtons;
