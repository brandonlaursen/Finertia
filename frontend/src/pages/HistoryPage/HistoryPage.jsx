import "./HistoryPage.css";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";

import {
  fetchAccountTransactions,
  fetchStockTransactions,
} from "../../../store/transactions";
import Pagination from "../../components/Pagination/Pagination";

function HistoryPage() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

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

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="HistoryPage">
      <header className="HistoryPage__title">Transaction History</header>

      {currentTransactions.length > 0 && (
        <>
          {currentTransactions.map((transaction, i) => {
            console.log(transaction);
            if (transaction.stockId) {
              return (
                <article className="HistoryPage__transfer" key={i}>
                  <div className="HistoryPage__message-container">
                    <span className="HistoryPage__message">{`${transaction.stockSymbol} Market ${transaction.transactionType}`}</span>
                    <time className="HistoryPage__date">
                      {new Date(transaction.purchaseDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <div className="HistoryPage__amount">
                    ${transaction.purchasePrice.toFixed(2)}
                  </div>
                </article>
              );
            } else {
              return (
                <article className="HistoryPage__transfer" key={i}>
                  <div className="HistoryPage__message-container">
                    <span className="HistoryPage__message">
                      {transaction.transactionType === "deposit"
                        ? `Deposit to Individual from Finertia Bank`
                        : `Withdrawal from Individual to Finertia Bank`}
                    </span>
                    <time className="HistoryPage__date">
                      {new Date(transaction.transactionDate).toLocaleString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>
                  <div className="HistoryPage__amount">
                    {transaction.transactionType === "deposit" ? "+" : "-"} $
                    {transaction.amount}
                  </div>
                </article>
              );
            }
          })}

          {/* {totalPages > 1 && (
            <div className="HistoryPage__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="HistoryPage__pagination-button"
              >
                Previous
              </button>
              <span className="HistoryPage__pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="HistoryPage__pagination-button"
              >
                Next
              </button>
            </div>
          )} */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default HistoryPage;
