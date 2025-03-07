import "./TransferModal.css";
import { RiQuestionLine } from "react-icons/ri";
import { GrFormCheckmark } from "react-icons/gr";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import CloseButton from "../../components/CloseButton";
import TransferModalAmountInput from "./TransferModalAmountInput";
import MoneyButtons from "./MoneyButtons/MoneyButtons";

import { depositFunds, withdrawFunds } from "../../../store/transactions";
import { useModal } from "../../context/Modal";
import TransferModalDropdown from "./TransferModalDropdown/TransferModalDropdown";
import TransferModalDropdownSection from "./TransferModalDropdownSection/TransferModalDropdownSection";

function TransferModal({ setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [from, setFrom] = useState("Bank");
  const [to, setTo] = useState("Individual");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showMoneyButtons, setShowMoneyButtons] = useState(true);
  const [disableButton, setDisableButton] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (amount == 0) {
      setShowMoneyButtons(true);
      setDisableButton(true);
    } else {
      setDisableButton(false);
    }
  }, [amount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        fromRef.current &&
        !fromRef.current.contains(e.target) &&
        toRef.current &&
        !toRef.current.contains(e.target)
      ) {
        setShowFrom(false);
        setShowTo(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

  const toggleDropdown = (dropdown) => {
    if (dropdown === "from") {
      setShowFrom((prev) => !prev);
      setShowTo(false);
    } else if (dropdown === "to") {
      setShowFrom(false);
      setShowTo((prev) => !prev);
    } else if (dropdown === "frequency") {
      setShowFrom(false);
      setShowTo(false);
    }
  };

  const transferModalProps = {
    from,
    to,
    setFrom,
    setTo,
    sessionUser,
    showFrom,
    showTo,
    setShowFrom,
    setShowTo,
    fromRef,
    toRef,
    toggleDropdown,
  };

  return (
    <div className="TransferModal">
      <div className="TransferModal__background">
        <span className="TransferModal-button-span">
          <CloseButton closeModal={closeModal} />
        </span>
      </div>

      <div className="TransferModal__container">
        <div className="TransferModal__header">
          <span className="TransferModal__header-title">Transfer money</span>
        </div>

        <TransferModalAmountInput
          showConfirmation={showConfirmation}
          setAmount={setAmount}
          amount={amount}
        />
        <MoneyButtons
          showMoneyButtons={showMoneyButtons}
          setShowMoneyButtons={setShowMoneyButtons}
          setAmount={setAmount}
        />

        <TransferModalDropdownSection {...transferModalProps} />

        <div className="TransferModal__section-footer">
          {showConfirmation ? (
            <>
              {error && (
                <span className="TransferModal__section-footer-error">
                  {error}
                </span>
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
      </div>
    </div>
  );
}

export default TransferModal;
