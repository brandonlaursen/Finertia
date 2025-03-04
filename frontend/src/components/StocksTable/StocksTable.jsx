import "./StocksTable.css";
import { useMemo, useState } from "react";

import StocksTableItem from "./StocksTableItem/StocksTableItem";
import LoadingSpinner from "../LoadingSpinner";

function StocksTable({
  stocks,
  listStocks = null,
  handleSort,
  navigate,
  setNotifications,
  setNotificationMessage,
  listId = null,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [stocksPerPage] = useState(10);

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

  // Calculate pagination
  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = stocksData.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(stocksData.length / stocksPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="StocksTable__container">
      <table className="StocksTable">
        <thead className="StocksTable__head">
          <tr>
            <th
              onClick={() => handleSort("name")}
              className="StocksTable__name"
            >
              Name
            </th>
            <th onClick={() => handleSort("symbol")}>Symbol</th>
            <th onClick={() => handleSort("current_price")}>Price</th>
            <th onClick={() => handleSort("todays_change_percent")}>Today</th>
            <th onClick={() => handleSort("market_cap")}>Market Cap</th>
            <th></th>
          </tr>
        </thead>

        {currentStocks.length ? (
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
        ) : (
          <tbody className="StocksTable__body">
            <tr>
              <td colSpan="6" className="StocksTable__no-data">
                <LoadingSpinner />
              </td>
            </tr>
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
