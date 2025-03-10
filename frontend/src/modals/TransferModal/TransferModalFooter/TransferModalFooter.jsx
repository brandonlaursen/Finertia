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
      if (amount > 1_000_000) {
        setError("Max deposit is limited to 1000000 for each deposit");
        setDisableButton(true);
        return;
      }
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
    <div className="TransferModalFooter">
      {showConfirmation ? (
        <>
          {error && <span className="TransferModalFooter__error">{error}</span>}
          {!error && (
            <span className="TransferModalFooter__message">
              {from === "Bank" &&
                `$${amount} will be withdrawn from Finertia Bank.`}
              {from === "Individual" &&
                `$${amount} will be deposited into Finertia bank.`}
            </span>
          )}

          <button
            className={`TransferModalFooter__button

               ${
                 disableButton
                   ? "TransferModalFooter__button--disabled"
                   : "TransferModalFooter__transfer-button"
               }`}
            onClick={submitTransaction}
            disabled={disableButton}
          >
            {isLoading ? (
              <span className="StockTransaction__spinner"></span>
            ) : (
              `Transfer $${amount}`
            )}
          </button>
          <button
            className="TransferModalFooter__button TransferModalFooter__cancel-button"
            onClick={() => {
              setShowConfirmation(false), setError(null);
              setDisableButton(false);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span className="TransferModal__footer-container">
            <span className="TransferModalFooter__message">
              {from === "Bank" && `    Daily deposit limit: No limits`}
              {from === "Individual" && `$${sessionUser.balance} available`}
              <span className="TransferModal__question-mark-container">
                <RiQuestionLine className="TransferModal__question-mark" />
              </span>
            </span>
          </span>
          <button
            className={`TransferModalFooter__button

              ${
                disableButton
                  ? "TransferModalFooter__button--disabled"
                  : "  TransferModalFooter__review-button"
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
