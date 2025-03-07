import "./TransferModalFooter.css";
import { RiQuestionLine } from "react-icons/ri";

import { useDispatch } from "react-redux";

import { depositFunds, withdrawFunds } from "../../../../store/transactions";

function TransferModalFooter({
  from,
  to,
  sessionUser,
  error,
  showConfirmation,
  amount,
  disableButton,
  isLoading,
  setShowConfirmation,
  setError,
  setShowMoneyButtons,
  setNotifications,
  setNotificationMessage,
  setIsLoading,
  setDisableButton,
  closeModal,
}) {
  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    setShowMoneyButtons(false);
    setShowConfirmation(true);
  }

  async function submitTransaction(e) {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);

    if (to === "Individual") {
      await dispatch(depositFunds(Number(amount)));
    }
    if (to === "Bank") {
      if (amount > sessionUser.balance) {
        setError("Amount exceeds your individual accounts balance");
        setDisableButton(true);
        return;
      }

      await dispatch(withdrawFunds(Number(amount)));
    }

    closeModal();

    setNotificationMessage([`Successfully transferred $${amount} to ${to}`]);
    setNotifications(true);

    await new Promise((resolve) => {
      setTimeout(() => {
        setNotifications(false);
        resolve();
      }, 10000);
    });

    setNotifications(false);
    setNotificationMessage([]);
  }

  return (
    <div className="TransferModal__section-footer">
      {showConfirmation ? (
        <>
          {error && (
            <span className="TransferModal__section-footer-error">{error}</span>
          )}
          {!error && (
            <span className="TransferModal__footer-title footer-confirm">
              {from === "Bank" &&
                `$${amount} will be withdrawn from Finertia Bank.`}
              {from === "Individual" &&
                `$${amount} will be deposited into Finertia bank.`}
            </span>
          )}

          <button
            className={`TransferModal__button ${
              !disableButton && "TransferModal__button-enabled"
            }`}
            onClick={submitTransaction}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              `Transfer $${amount}`
            )}
          </button>

          <button
            className="TransferModal__button cancel-button"
            onClick={() => {
              setShowConfirmation(false), setError(null);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="TransferModal__footer-container">
            <span className="TransferModal__footer-title">
              {from === "Bank" && `    Daily deposit limit: No limits`}
              {from === "Individual" && `$${sessionUser.balance} available`}
              <span className="TransferModal__question-mark-container">
                <RiQuestionLine className="TransferModal__question-mark" />
              </span>
            </span>
          </span>
          <button
            className={`TransferModal__button ${
              !disableButton && "TransferModal__button-enabled"
            }`}
            onClick={handleSubmit}
            disabled={disableButton}
          >
            Review Transfer
          </button>
        </>
      )}
    </div>
  );
}

export default TransferModalFooter;
