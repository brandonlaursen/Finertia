import { FaAngleUp } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { useState } from "react";

import TransferModal from "../../../Modals/TransferModal/TransferModal";
import { useModal } from "../../../../context/Modal";

function BuyingPowerDropDown({ sessionUser }) {
  const { setModalContent, setModalClass } = useModal();

  const [dropDownVisible, setDropDownVisible] = useState(false);

  const { balance } = sessionUser;

  return (
    <>
      <div
        className="HomePage__main__buying-power"
        onClick={() => setDropDownVisible(!dropDownVisible)}
      >
        <span>Buying Power</span>
        <span className="HomePage__main__buying-power-span">
          ${balance}
          {dropDownVisible ? <FaAngleUp /> : <FaAngleDown />}
        </span>
      </div>
      {dropDownVisible && (
        <div className="HomePage__main__buying-power__dropdown">
          <div className="HomePage__main__dropdown-contents">
            <div className="dropdown-contents-text-container">
              <div className="dropdown-contents-text">
                <span>Individual Cash</span>
                <span>${balance}</span>
              </div>
              <div className="dropdown-contents-text">
                <span>Total</span>
                <span>${balance}</span>
              </div>
            </div>

            <div className="dropdown-contents-text-button-container">
              <button
                className="dropdown-contents-text-button"
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BuyingPowerDropDown;
