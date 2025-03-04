import "./CompletedTransfers.css";
import { useState } from "react";

function CompletedTransfers({ transactions }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [transfersPerPage] = useState(5);

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

          {totalPages > 1 && (
            <div className="CompletedTransfers__pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="CompletedTransfers__pagination-button"
              >
                Previous
              </button>
              <span className="CompletedTransfers__pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="CompletedTransfers__pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default CompletedTransfers;
