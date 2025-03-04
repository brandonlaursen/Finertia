import "./TransfersPage.css";
import { FaMoneyBill } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { RiQuestionLine } from "react-icons/ri";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import TransferModal from "../../modals/TransferModal";

import { fetchAccountTransactions } from "../../../store/transactions";


import CompletedTransfers from "./CompletedTransfers";

import { useModal } from "../../context/Modal";

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

  return (
    <div className="TransfersPage">
      <header className="TransfersPage__header">
        <span className="TransfersPage__title">Start a Transfer</span>
        <span className="TransfersPage__subtext">
          Learn more about your <span>transfer limits.</span>
        </span>
      </header>

      <section className="TransfersPage__section">
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
          <div className="TransferPage__transfer-link__text-container">
            <span className="TransferPage__transfer-link__title">Transfer Money</span>
            <span className="TransfersPage__transfer-link__subtitle">
              Transfer Money between your bank and your Finertia Account
            </span>
          </div>
          <div className="TransfersPage__arrow-container">
            <IoIosArrowForward className="TransfersPage__arrow-icon" />
          </div>
        </div>
      </section>

      <section className="TransfersPage__section">
        <div className="TransfersPage__transfer-container">
          <span className="TransfersPage__title">
            Available to withdraw
          </span>
          <span className="TransfersPage__subtext">
            Exclusions may apply, depending on your account type and activity.
          </span>
        </div>

        <div className="TransfersPage__withdraw-section">
          <span className="TransfersPage__withdraw-section-title">
            Individual cash available
            <RiQuestionLine className="TransfersPage__question-mark-icon" />
          </span>
          <span className="TransfersPage__withdraw-section-amount">
            ${sessionUser.balance}
          </span>
        </div>
      </section>

      <CompletedTransfers transactions={transactions} />
    </div>
  );
}

export default TransfersPage;
