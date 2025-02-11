import "./TransfersPage.css";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { RiQuestionLine } from "react-icons/ri";
import { useModal } from "../../../context/Modal";

import TransferModal from "../TransferModal/TransferModal";

function TransfersPage() {
  const { setModalContent, setModalClass } = useModal();

  return (
    <div className="TransfersPage">
      <div className="TransfersPage__section">
        <div className="TransfersPage__transfer">
          <span className="TransfersPage__transfer-title">
            Start a transfer
          </span>
          <span className="TransfersPage__transfer-subtext">
            Learn more about your <span>transfer limits.</span>
          </span>
        </div>
      </div>

      <div>
        <div className="TransfersPage__invest-section">
          <div
            className="TransfersPage__container"
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
            <div className="TransfersPage__container-icon">
              <FaMoneyBill className="TransfersPage__money-icon" />
            </div>
            <div className="TransfersPage__text">
              <span className="TransfersPage__title">Transfer Money</span>
              <span className="TransfersPage__subtitle">
                Transfer Money between your bank and your Finertia Account
              </span>
            </div>
            <div className="TransfersPage__arrow">
              <IoIosArrowForward className="TransfersPage__arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="TransfersPage__section">
        <div className="TransfersPage__transfer">
          <span className="TransfersPage__transfer-title">
            Available to withdraw
          </span>
          <span className="TransfersPage__transfer-subtext">
            Exclusions may apply, depending on your account type and activity.
          </span>
        </div>

        <div className="TransfersPage__withdraw">
          <span className="TransfersPage__withdraw-title">
            {" "}
            Individual cash available
            <RiQuestionLine className="TransfersPage__question-mark" />
          </span>
          <span className="TransfersPage__withdraw-amount">$0.01</span>
        </div>
      </div>

      <div className="TransfersPage__completed">
        <div className="TransfersPage__completed-title">
          Completed Transfers
        </div>

        <div className="TransfersPage__completed-transactions">
          <div className="TransfersPage__completed-contents">
            <span className="TransfersPage__completed-transactions-title">
              Withdrawal from individual to Wells Fargo Everyday Checking
            </span>
            <span className="TransfersPage__completed-transactions-date">
              Jan 21, 2025
            </span>
          </div>
          <div className="TransfersPage__completed-transactions-amount">
            -$40.00
          </div>
        </div>

        <div className="TransfersPage__completed-transactions">
          <div className="TransfersPage__completed-contents">
            <span className="TransfersPage__completed-transactions-title">
              Deposit to individual to Wells Fargo Everyday Checking
            </span>
            <span className="TransfersPage__completed-transactions-date">
              Jan 21, 2025
            </span>
          </div>
          <div className="TransfersPage__completed-transactions-amount">
            +$90.00
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransfersPage;
