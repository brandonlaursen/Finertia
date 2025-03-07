import "./TransferModal.css";

import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import CloseButton from "../../components/CloseButton";
import TransferModalAmountInput from "./TransferModalAmountInput";
import MoneyButtons from "./MoneyButtons/MoneyButtons";
import TransferModalDropdownSection from "./TransferModalDropdownSection/TransferModalDropdownSection";

import { useModal } from "../../context/Modal";
import TransferModalFooter from "./TransferModalFooter/TransferModalFooter";

function TransferModal({ setNotifications, setNotificationMessage }) {
  const { closeModal } = useModal();

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
        <TransferModalFooter {...transferModalProps} />
      </div>
    </div>
  );
}

export default TransferModal;
