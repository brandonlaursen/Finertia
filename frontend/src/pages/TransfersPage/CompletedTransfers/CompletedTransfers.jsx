import "./CompletedTransfers.css";
import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { fetchAccountTransactions } from "../../../../store/transactions";
import Pagination from "../../../components/Pagination/Pagination";

function CompletedTransfers({ transactions }) {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [transfersPerPage] = useState(5);

  useEffect(() => {
    dispatch(fetchAccountTransactions());
  }, [dispatch]);

  const sortedTransactions = transactions.sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate) : new Date(0);
    const dateB = b.transactionDate ? new Date(b.transactionDate) : new Date(0);

    return dateB - dateA;
  });

  const indexOfLastTransfer = currentPage * transfersPerPage;
  const indexOfFirstTransfer = indexOfLastTransfer - transfersPerPage;
  const currentTransfers = sortedTransactions.slice(
    indexOfFirstTransfer,
    indexOfLastTransfer
  );
  const totalPages = Math.ceil(sortedTransactions.length / transfersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <section className="CompletedTransfers">
      <header className="CompletedTransfers__title">Completed Transfers</header>

      {currentTransfers.length > 0 && (
        <>
          {currentTransfers.map((transaction, i) => {
            return (
              <article className="CompletedTransfers__transfer" key={i}>
                <div className="CompletedTransfers__message-container">
                  <span className="CompletedTransfers__message">
                    {transaction.transactionType === "withdraw"
                      ? "Withdrawal from Finertia Bank"
                      : "Deposit to Individual from Finertia Band "}
                  </span>
                  <time className="CompletedTransfers__date">
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
                <div className="CompletedTransfers__amount">
                  {transaction.transactionType === "withdraw" ? "-" : "+"} $
                  {transaction.amount}
                </div>
              </article>
            );
          })}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}

export default CompletedTransfers;
