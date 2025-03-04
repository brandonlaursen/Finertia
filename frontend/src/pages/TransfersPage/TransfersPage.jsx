import "./TransfersPage.css";
import { RiQuestionLine } from "react-icons/ri";

import { useSelector } from "react-redux";

import TransferMoney from "./TransferMoney";
import CompletedTransfers from "./CompletedTransfers";

import { selectUser } from "../../../store/session";

function TransfersPage() {

  const sessionUser = useSelector(selectUser);
  const transactions = useSelector(
    (state) => state.transactions.accountTransactions
  );

  return (
    <div className="TransfersPage">
      <header className="TransfersPage__header">
        <span className="TransfersPage__title">Start a Transfer</span>
        <span className="TransfersPage__subtext">
          Learn more about your <span>transfer limits.</span>
        </span>
      </header>

      <TransferMoney />

      <section className="TransfersPage__section">
        <div className="TransfersPage__transfer-container">
          <span className="TransfersPage__title">Available to withdraw</span>
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
