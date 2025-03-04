import "./TransferMoney.css";

import { useModal } from "../../../context/Modal";

import TransferModal from "../../../modals/TransferModal";

import { FaMoneyBill } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

function TransferMoney() {
  const { setModalContent, setModalClass } = useModal();

  return (
    <section className="TransferMoney">
      <div
        className="TransferMoney__button"
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
        <div className="TransferMoney__money-icon-container">
          <FaMoneyBill className="TransferMoney__money-icon" />
        </div>
        <div className="TransferMoney__text-container">
          <span className="TransferMoney__title">Transfer Money</span>
          <span className="TransferMoney__subtitle">
            Transfer Money between your bank and your Finertia Account
          </span>
        </div>
        <div className="TransferMoney__arrow-container">
          <IoIosArrowForward className="TransferMoney__arrow-icon" />
        </div>
      </div>
    </section>
  );
}

export default TransferMoney;
