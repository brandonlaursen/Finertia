import "./TransferModal.css";
import { MdClose } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";

import { useModal } from "../../../context/Modal";

import { useState, useEffect, useRef } from "react";

function TransferModal() {
  const { closeModal } = useModal();

  const [amount, setAmount] = useState(0.0);
  const [from, setFrom] = useState("Bank");
  const [to, setTo] = useState("Individual");
  const [frequency, setFrequency] = useState("Just once");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [showMoneyButtons, setShowMoneyButtons] = useState(true);

  const fromRef = useRef(null);
  const toRef = useRef(null);
  const frequencyRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();

    const transaction = {
      amount: Number(amount),
      from,
      to,
      frequency,
    };

    console.log(transaction);
  }

  useEffect(() => {
    if (amount == 0) {
      setShowMoneyButtons(true);
    }
  }, [amount]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdown if click is outside of any dropdown
      if (
        fromRef.current &&
        !fromRef.current.contains(e.target) &&
        toRef.current &&
        !toRef.current.contains(e.target) &&
        frequencyRef.current &&
        !frequencyRef.current.contains(e.target)
      ) {
        setShowFrom(false);
        setShowTo(false);
        setShowFrequency(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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

        <div className="TransferModal__input-container">
          <div className="TransferModal__section">
            <span className={`TransferModal__amount-title`}>Amount</span>
            <div className="input-wrapper">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                pattern="[0-9]*"
                className="amount-input"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
                placeholder={0}
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
            <div
              className={`TransferModal__from-dropdown-button ${
                showFrom && "TransferModal__amount-title-green"
              }`}
              onClick={() => setShowFrom(!showFrom)}
              ref={fromRef}
            >
              {from}
            </div>
            {showFrom && (
              <div className="TransferModal__from-dropdown">
                <div onClick={() => setFrom("Bank")}>Bank</div>
                <div onClick={() => setFrom("Individual")}>Individual</div>
              </div>
            )}
          </div>

          <div className="TransferModal__section-two">
            <span className="TransferModal__amount-title">To</span>
            <div
              className={`TransferModal__from-dropdown-button ${
                showTo && "TransferModal__amount-title-green"
              }`}
              onClick={() => setShowTo(!showTo)}
              ref={toRef}
            >
              {to}
            </div>
            {showTo && (
              <div className="TransferModal__from-dropdown">
                <div onClick={() => setTo("Individual")}>Individual</div>
                <div onClick={() => setTo("Bank")}>Bank</div>
              </div>
            )}
          </div>

          <div className="TransferModal__section-two">
            <span className="TransferModal__amount-title">Frequency</span>
            <div
              className={`TransferModal__from-dropdown-button ${
                showFrequency && "TransferModal__amount-title-green"
              }`}
              onClick={() => setShowFrequency(!showFrequency)}
              ref={frequencyRef}
            >
              {frequency}
            </div>
            {showFrequency && (
              <div className="TransferModal__from-dropdown">
                <div onClick={() => setFrequency("Just once")}>Just once</div>
                <div onClick={() => setFrequency("Weekly")}>Weekly</div>
                <div onClick={() => setFrequency("Twice a month")}>
                  Twice a month
                </div>
                <div onClick={() => setFrequency("Monthly")}>Monthly</div>
                <div onClick={() => setFrequency("Quarterly")}>Quarterly</div>
              </div>
            )}
          </div>
        </div>

        <div className="TransferModal__section-footer">
          <span className="TransferModal__footer-title">
            Daily deposit limit: $150,000
            <span className="TransferModal__question-mark-container">
              <RiQuestionLine className="TransferModal__question-mark" />
            </span>
          </span>
          <button className="TransferModal__button" onClick={handleSubmit}>
            Review Transfer
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransferModal;
