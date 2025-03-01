import "./HistoryPage.css";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  fetchAccountTransactions,
  fetchStockTransactions,
} from "../../../../store/transactions";

function HistoryPage() {
  const dispatch = useDispatch();

  const transactions = useSelector((state) => state.transactions);

  useEffect(() => {
    dispatch(fetchAccountTransactions());
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  const mergedTransactions = [
    ...transactions.stockTransactions,
    ...transactions.accountTransactions,
  ];

  const sortedTransactions = mergedTransactions.sort((a, b) => {
    const dateA = a.transactionDate
      ? new Date(a.transactionDate)
      : new Date(a.purchaseDate);
    const dateB = b.transactionDate
      ? new Date(b.transactionDate)
      : new Date(b.purchaseDate);

    return dateB - dateA;
  });

  return (
    <div className="HistoryPage">
      <div className="HistoryPage__section"></div>

      <div className="TransfersPage__completed-transfer-section">
        <div className="TransfersPage__completed-transfer-section-title">
          Completed Transfers
        </div>

        {sortedTransactions.length > 0 &&
          sortedTransactions.slice(0, 10).map((transaction, i) => {
            if (transaction.stockId) {
              return (
                <div
                  className="TransfersPage__completed-transactions-container"
                  key={i}
                >
                  <div className="TransfersPage__completed-contents">
                    <span className="HistoryPage__completed-transactions-title">{`${transaction.stockSymbol} ${transaction.transactionType}`}</span>
                    <span className="HistoryPage__completed-transactions-date">
                      {new Date(transaction.purchaseDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="TransfersPage__completed-transactions-amount">
                    ${transaction.purchasePrice.toFixed(2)}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className="TransfersPage__completed-transactions-container"
                  key={i}
                >
                  <div className="TransfersPage__completed-contents">
                    <span className="HistoryPage__completed-transactions-title">
                      {transaction.transactionType === "deposit"
                        ? `Deposit from Finertia Bank into individual`
                        : `Withdraw from individual to Finertia Bank`}
                    </span>
                    <span className="HistoryPage__completed-transactions-date">
                      {new Date(transaction.transactionDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="TransfersPage__completed-transactions-amount">
                    {transaction.transactionType === "deposit" ? "+" : "-"} $
                    {transaction.amount}
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default HistoryPage;
