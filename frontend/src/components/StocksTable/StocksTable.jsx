import "./StocksTable.css";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

import { useMemo, useState, useEffect } from "react";

import StocksTableHeader from "./StocksTableHeader";
import StocksTableBody from "./StocksTableBody";

import Pagination from "../Pagination/Pagination";

function StocksTable({
  stocks,
  listStocks = null,
  navigate,
  setNotifications,
  setNotificationMessage,
  listId = null,
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const indexOfLastStock = currentPage * stocksPerPage;
  const indexOfFirstStock = indexOfLastStock - stocksPerPage;
  const currentStocks = sortedStocks.slice(indexOfFirstStock, indexOfLastStock);
  const totalPages = Math.ceil(sortedStocks.length / stocksPerPage);

  const stocksTableProps = {
    isLoading,
    currentStocks,
    navigate,
    setNotifications,
    setNotificationMessage,
    listId,
    listStocks,
  };

  return (
    <div className="StocksTable__container">
      <table className="StocksTable">
        <StocksTableHeader
          handleSortClick={handleSortClick}
          getSortIcon={getSortIcon}
        />
        <StocksTableBody {...stocksTableProps} />
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

export default StocksTable;
