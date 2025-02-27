import "./TransferModal.css";
import { MdClose } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";
import { GrFormCheckmark } from "react-icons/gr";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { depositFunds, withdrawFunds } from "../../../../store/transactions";

import { useModal } from "../../../context/Modal";

function TransferModal() {
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

  return (
    <div className="TransferModal">
      <div className="TransferModal__background">
        <span className="TransferModal-button-span">
          <span className="TransferModal-button-container">
            <MdClose
              className="TransferModal__close-button"
              onClick={closeModal}
            />
          </span>
        </span>
      </div>

      <div className="TransferModal__container">
        <div className="TransferModal__header">
          <span className="TransferModal__header-title">Transfer money</span>
        </div>

        <div>
          <div className="TransferModal__section">
            <span className={`TransferModal__amount-title`}>Amount</span>

            <div
              className={`input-wrapper ${showConfirmation && "InputDisabled"}`}
            >
              <span className="dollar-sign">$</span>
              <input
                type="number"
                pattern="[0-9]*"
                className="amount-input"
                value={amount || ""}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder={0}
                disabled={showConfirmation}
              />
            </div>
          </div>

          {showMoneyButtons && (
            <div className="TransferModal__section">
              <div className="TransferModal__amount-container">
                <button
                  className="TransferModal__amount"
                  onClick={() => {
                    setShowMoneyButtons(false), setAmount(100);
                  }}
                >
                  $100
                </button>
                <button
                  className="TransferModal__amount"
                  onClick={() => {
                    setShowMoneyButtons(false), setAmount(300);
                  }}
                >
                  $300
                </button>
                <button
                  className="TransferModal__amount"
                  onClick={() => {
                    setShowMoneyButtons(false), setAmount(1000);
                  }}
                >
                  $1,000
                </button>
              </div>
            </div>
          )}

          <div className="TransferModal__section-two">
            <span className={`TransferModal__amount-title`}>From</span>
            {showConfirmation ? (
              <div
                className={`TransferModal__from-dropdown-button TransferModalDisabled`}
              >
                {from}
              </div>
            ) : (
              <div
                className={`TransferModal__from-dropdown-button ${
                  showFrom && "TransferModal__amount-title-green"
                }`}
                onClick={() => toggleDropdown("from")}
                ref={fromRef}
              >
                {from} {from === "Individual" && `· $${sessionUser.balance}`}
              </div>
            )}

            {showFrom && (
              <div className="TransferModal__from-dropdown">
                <div className="TransferModal__from-dropdown-individual">
                  <span className="TransferModal__from-dropdown-individual-header">
                    Fintertia accounts
                  </span>
                  <div
                    onClick={() => {
                      setFrom("Individual"), setTo("Bank");
                    }}
                    className={`TransferModal__from-dropdown-individual-container ${
                      from === "Individual"
                        ? "TransferModal__from-dropdown-individual-selected"
                        : ""
                    }`}
                  >
                    <div className="checkmark-div">
                      {from === "Individual" && (
                        <GrFormCheckmark className="TransferModal__checkmark" />
                      )}
                    </div>

                    <div className="dropdown-text-div">
                      <span className="TransferModal__from-dropdown-container-text">
                        Individual
                      </span>
                      <span className="TransferModal__from-dropdown-container-subtext">
                        Withdrawable cash · ${sessionUser.balance}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="TransferModal__from-dropdown-individual">
                  <span className="TransferModal__from-dropdown-individual-header">
                    External accounts
                  </span>
                  <div
                    onClick={() => {
                      setFrom("Bank"), setTo("Individual");
                    }}
                    className={`TransferModal__from-dropdown-individual-container ${
                      from === "Bank"
                        ? "TransferModal__from-dropdown-individual-selected"
                        : ""
                    }`}
                  >
                    <div className="checkmark-div">
                      {from === "Bank" && (
                        <GrFormCheckmark className="TransferModal__checkmark" />
                      )}
                    </div>

                    <div className="dropdown-text-div">
                      <span className="TransferModal__from-dropdown-container-text">
                        Finertia Bank
                      </span>
                      <span className="TransferModal__from-dropdown-container-subtext">
                        Typically 1-2 seconds
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="TransferModal__section-two">
            <span className="TransferModal__amount-title">To</span>

            {showConfirmation ? (
              <div
                className={`TransferModal__from-dropdown-button TransferModalDisabled`}
              >
                {to}
              </div>
            ) : (
              <div
                className={`TransferModal__from-dropdown-button ${
                  showTo && "TransferModal__amount-title-green"
                }`}
                onClick={() => toggleDropdown("to")}
                ref={toRef}
              >
                {from === "Bank" ? "Individual" : "Bank"}
              </div>
            )}

            {showTo && (
              <div className="TransferModal__from-dropdown">
                {to === "Bank" ? (
                  <div className="TransferModal__from-dropdown-individual">
                    <span className="TransferModal__from-dropdown-individual-header">
                      External accounts
                    </span>
                    <div
                      className={`TransferModal__from-dropdown-individual-container ${
                        to === "Individual"
                          ? "TransferModal__from-dropdown-individual-selected"
                          : ""
                      }`}
                    >
                      <div className="checkmark-div">
                        {to === "Bank" && (
                          <GrFormCheckmark className="TransferModal__checkmark" />
                        )}
                      </div>

                      <div className="dropdown-text-div">
                        <span className="TransferModal__from-dropdown-container-text">
                          Finertia Bank
                        </span>
                        <span className="TransferModal__from-dropdown-container-subtext">
                          Typically 1-2 seconds
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="TransferModal__from-dropdown-individual">
                    <span className="TransferModal__from-dropdown-individual-header">
                      Fintertia accounts
                    </span>
                    <div
                      className={`TransferModal__from-dropdown-individual-container ${
                        to === "Individual"
                          ? "TransferModal__from-dropdown-individual-selected"
                          : ""
                      }`}
                    >
                      <div className="checkmark-div">
                        {to === "Individual" && (
                          <GrFormCheckmark className="TransferModal__checkmark" />
                        )}
                      </div>

                      <div className="dropdown-text-div">
                        <span className="TransferModal__from-dropdown-container-text">
                          Individual · ${sessionUser.balance}
                        </span>
                        <span className="TransferModal__from-dropdown-container-subtext">
                          Withdrawable cash
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
                  {from === "Individual" &&
                    `$${sessionUser.balance} available`}
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
