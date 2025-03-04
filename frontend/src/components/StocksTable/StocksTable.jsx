import "./StocksTable.css";
import { useMemo, useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

import StocksTableItem from "./StocksTableItem/StocksTableItem";
import Skeleton from "../Skeleton";

function StocksTable({
  stocks,
  listStocks = null,
  navigate,
  setNotifications,
  setNotificationMessage,
  listId = null,
  // isLoading = false,
}) {
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const stocksData = useMemo(() => {
    if (!listStocks) return stocks;

    return listStocks.map((stock) => ({
      id: stock.id,
      name: stock.stockName,
      symbol: stock.stockSymbol,
      current_price: stocks[stock.id]?.current_price ?? 0,
      todays_change_percent: stocks[stock.id]?.todays_change_percent ?? 0,
      market_cap: stocks[stock.id]?.market_cap ?? 0,
    }));
  }, [listStocks, stocks]);

  const sortedStocks = useMemo(() => {
    if (!sortConfig.key) return stocksData;

    return [...stocksData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [stocksData, sortConfig]);

  // Calculate pagination
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = sortedStocks.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(sortedStocks.length / stocksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortClick = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="StocksTable__sort-icon" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="StocksTable__sort-icon StocksTable__sort-icon--active" />
    ) : (
      <FaSortDown className="StocksTable__sort-icon StocksTable__sort-icon--active" />
    );
  };

  // Simulate loading state
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  return (
    <div className="StocksTable__container">
      <table className="StocksTable">
        <thead className="StocksTable__head">
          <tr>
            <th onClick={() => handleSortClick("name")}>
              Name {getSortIcon("name")}
            </th>
            <th onClick={() => handleSortClick("symbol")}>
              Symbol {getSortIcon("symbol")}
            </th>
            <th onClick={() => handleSortClick("current_price")}>
              Price {getSortIcon("current_price")}
            </th>
            <th onClick={() => handleSortClick("todays_change_percent")}>
              Today {getSortIcon("todays_change_percent")}
            </th>
            <th onClick={() => handleSortClick("market_cap")}>
              Market Cap {getSortIcon("market_cap")}
            </th>
            <th></th>
          </tr>
        </thead>

        {isLoading ? (
          <tbody className="StocksTable__body">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="StocksTable__skeleton-row">
                <td colSpan="6">
                  <Skeleton width="100%" height="40px" />
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody className="StocksTable__body">
            {currentStocks.map((stock) => {
              return (
                <StocksTableItem
                  key={stock.id}
                  stock={stock}
                  navigate={navigate}
                  setNotifications={setNotifications}
                  setNotificationMessage={setNotificationMessage}
                  listId={listId}
                />
              );
            })}
          </tbody>
        )}
      </table>

      {totalPages > 1 && (
        <div className="StocksTable__pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="StocksTable__pagination-button"
          >
            Previous
          </button>
          <span className="StocksTable__pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="StocksTable__pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StocksTable;
