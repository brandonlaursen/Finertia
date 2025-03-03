import "./BuyingPowerDropDown.css";
import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";

import { useState } from "react";

import TransferModal from '../../../modals/TransferModal';

import { useModal } from "../../../context/Modal";

function BuyingPowerDropDown({ sessionUser }) {
  const { setModalContent, setModalClass } = useModal();

  const [isDropDownVisible, setDropDownIsVisible] = useState(false);

  const { balance } = sessionUser.stockSummary;

  return (
    <div
      className={`BuyingPowerDropDown ${
        isDropDownVisible && "BuyingPowerDropDown--highlight"
      }`}
    >
      <div
        className="BuyingPowerDropDown__toggle"
        onClick={() => setDropDownIsVisible(!isDropDownVisible)}
      >
        <span>Buying Power</span>
        <span className="BuyingPowerDropDown__balance">
          ${balance.toFixed(2)}
          {isDropDownVisible ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </div>

      {isDropDownVisible && (
        <div className="BuyingPowerDropDown__dropdown">
          <main className="BuyingPowerDropDown__dropdown-main">
            <section className="BuyingPowerDropDown__summary">
              <div className="BuyingPowerDropDown__summary-text">
                <span>Individual Cash</span>
                <span>${balance.toFixed(2)}</span>
              </div>
              <div className="BuyingPowerDropDown__summary-text">
                <span>Total</span>
                <span>${balance.toFixed(2)}</span>
              </div>
            </section>

            <section className="BuyingPowerDropDown__button-container">
              <button
                className="BuyingPowerDropDown__button"
                onClick={(e) => {
                  e.stopPropagation();
                  setModalContent(<TransferModal />);
                  setModalClass({
                    modal: "TransferModal",
                    modalBackground: "TransferModal__background",
                    modalContainer: "TransferModal__container",
                  });
                }}
              >
                Deposit Funds
              </button>
            </section>
          </main>
        </div>
      )}
    </div>
  );
}

export default BuyingPowerDropDown;
