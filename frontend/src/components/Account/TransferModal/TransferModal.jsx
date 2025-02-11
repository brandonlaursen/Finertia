import "./TransferModal.css";
import { MdClose } from "react-icons/md";
import { RiQuestionLine } from "react-icons/ri";

import { useModal } from "../../../context/Modal";

import { useState } from "react";

function TransferModal() {
  const { closeModal } = useModal();

  const [amount, setAmount] = useState("$0.00");
  const [from, setFrom] = useState("Bank");
  const [to, setTo] = useState("Individual");
  const [frequency, setFrequency] = useState("Just once");
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    const transaction = {
      amount,
      from,
      to,
      frequency,
    };

    console.log(transaction);
  }

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
            <span className="TransferModal__amount-title">Amount</span>
            <input
              className="TransferModal__amount-input"
              placeholder={`$0.00`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="TransferModal__section">
            <div className="TransferModal__amount-container">
              <button className="TransferModal__amount">$100</button>
              <button className="TransferModal__amount">$300</button>
              <button className="TransferModal__amount">$1,000</button>
            </div>
          </div>

          <div className="TransferModal__section-two">
            <span className="TransferModal__amount-title">From</span>
            <div
              className="TransferModal__from-dropdown-button"
              onClick={() => setShowFrom(!showFrom)}
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
              className="TransferModal__from-dropdown-button"
              onClick={() => setShowTo(!showTo)}
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
              className="TransferModal__from-dropdown-button"
              onClick={() => setShowFrequency(!showFrequency)}
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
