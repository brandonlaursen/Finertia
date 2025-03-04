import "./CompletedTransfers.css";

function CompletedTransfers({ transactions }) {
  const sortedTransactions = transactions.sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate) : new Date(0);
    const dateB = b.transactionDate ? new Date(b.transactionDate) : new Date(0);

    return dateB - dateA;
  });

  return (
    <section className="CompletedTransfers">
      <header className="CompletedTransfers__title">Completed Transfers</header>

      {sortedTransactions.length > 0 &&
        sortedTransactions.map((transaction, i) => {
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
    </section>
  );
}

export default CompletedTransfers;
