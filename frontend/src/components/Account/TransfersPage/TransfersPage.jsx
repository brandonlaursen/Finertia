import "./TransfersPage.css";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { RiQuestionLine } from "react-icons/ri";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TransferModal from "../../Modals/TransferModal/TransferModal";

import { fetchAccountTransactions } from "../../../../store/transactions";

import { useModal } from "../../../context/Modal";

function TransfersPage() {
  const { setModalContent, setModalClass } = useModal();
  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);
  const transactions = useSelector(
    (state) => state.transactions.accountTransactions
  );

  useEffect(() => {
    dispatch(fetchAccountTransactions());
  }, [dispatch]);

  function convertTime(timestamp) {
    const parts = timestamp.split("T")[0].split("-");

    return `${parts[1]}-${parts[2]}-${parts[0]}`;
  }

  return (
    <div className="TransfersPage">
      <div className="TransfersPage__section">
        <div className="TransfersPage__transfer-container">
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
            className="TransferPage__transfer-link"
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
            <div className="TransferPage__transfer__money-icon-container">
              <FaMoneyBill className="TransfersPage__money-icon" />
            </div>
            <div className="TransfersPage__text">
              <span className="TransfersPage__title">Transfer Money</span>
              <span className="TransfersPage__subtitle">
                Transfer Money between your bank and your Finertia Account
              </span>
            </div>
            <div className="TransfersPage__arrow-container">
              <IoIosArrowForward className="TransfersPage__arrow-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="TransfersPage__section">
        <div className="TransfersPage__transfer-container">
          <span className="TransfersPage__transfer-title">
            Available to withdraw
          </span>
          <span className="TransfersPage__transfer-subtext">
            Exclusions may apply, depending on your account type and activity.
          </span>
        </div>

        <div className="TransfersPage__withdraw-section">
          <span className="TransfersPage__withdraw-section-title">
            {" "}
            Individual cash available
            <RiQuestionLine className="TransfersPage__question-mark-icon" />
          </span>
          <span className="TransfersPage__withdraw-section-amount">
            ${sessionUser.balance}
          </span>
        </div>
      </div>

      <div className="TransfersPage__completed-transfer-section">
        <div className="TransfersPage__completed-transfer-section-title">
          Completed Transfers
        </div>

        {transactions.length &&
          transactions.map((transaction, i) => {
            return (
              <div className="TransfersPage__completed-transactions-container" key={i}>
                <div className="TransfersPage__completed-contents">
                  <span className="TransfersPage__completed-transactions-title">
                    {transaction.transactionType === "withdraw"
                      ? "Withdrawal from Finertia Bank"
                      : "Deposit to Individual from Finertia Band "}
                  </span>
                  <span className="TransfersPage__completed-transactions-date">
                    {convertTime(transaction.transactionDate)}
                  </span>
                </div>
                <div className="TransfersPage__completed-transactions-amount">
                  {transaction.transactionType === "withdraw" ? "-" : "+"} $
                  {transaction.amount}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default TransfersPage;
