import "./HistoryPage.css";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import Pagination from "../../components/Pagination/Pagination";

import {
  fetchAccountTransactions,
  fetchStockTransactions,
} from "../../../store/transactions";

function HistoryPage() {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

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
    const dateA = new Date(a.transactionDate || a.purchaseDate);
    const dateB = new Date(b.transactionDate || b.purchaseDate);
    return dateB - dateA;
  });

  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * transactionsPerPage,
    currentPage * transactionsPerPage
  );

  const totalPages = Math.ceil(sortedTransactions.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const renderTransaction = (transaction, index) => {
    const isStockTransaction = transaction.stockId;
    return (
      <article className="HistoryPage__article" key={index}>
        <section className="HistoryPage__details">
          <span className="HistoryPage__description">
            {isStockTransaction
              ? `${transaction.stockSymbol} Market ${transaction.transactionType}`
              : transaction.transactionType === "deposit"
              ? `Deposit to Individual from Finertia Bank`
              : `Withdrawal from Individual to Finertia Bank`}
          </span>
          <time className="HistoryPage__date">
            {formatDate(
              transaction.purchaseDate || transaction.transactionDate
            )}
          </time>
        </section>
        <section className="HistoryPage__amount">
          {isStockTransaction
            ? `$${transaction.purchasePrice.toFixed(2)}`
            : `${transaction.transactionType === "deposit" ? "+" : "-"} $${
                transaction.amount
              }`}
        </section>
      </article>
    );
  };

  return (
    <div className="HistoryPage">
      <header className="HistoryPage__title">Transaction History</header>

      {paginatedTransactions.length > 0 && (
        <>
          {paginatedTransactions.map(renderTransaction)}
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
