import "./ListPageStockTable.css";

import { useState, useEffect } from "react";

import LoadingSpinner from "../../LoadingSpinner";
import ListPageStockTableItem from "../ListPageStockTableItem";

function ListPageStockTable({ list, listId, stocks, navigate }) {
  const [sortedStocks, setSortedStocks] = useState([]);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const listStocks = list.Stocks;

  useEffect(() => {
    if (listStocks && listStocks.length > 0) {
      setSortedStocks(listStocks);
    } else {
      setSortedStocks([]);
    }
  }, [list, listId, listStocks]);

  const handleSort = (criteria) => {
    let sortedData = [...listStocks];

    const newDirection =
      criteria === sortCriteria && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    if (criteria === "name") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.stockName.localeCompare(b.stockName)
          : b.stockName.localeCompare(a.stockName)
      );
    } else if (criteria === "symbol") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.stockSymbol.localeCompare(b.stockSymbol)
          : b.stockSymbol.localeCompare(a.stockSymbol)
      );
    } else if (criteria === "current_price") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.current_price - b.current_price
          : b.current_price - a.current_price
      );
    } else if (criteria === "market_cap") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.market_cap - b.market_cap
          : b.market_cap - a.market_cap
      );
    } else if (criteria === "todays_change_percent") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.todays_change_percent - b.todays_change_percent
          : b.todays_change_percent - a.todays_change_percent
      );
    }

    setSortedStocks(sortedData);
    setSortCriteria(criteria);
  };

  return (
    <div className="stocks__table-container">
      {sortedStocks.length === 0 ? (
        <div className="ListPage__no-stocks">
          <span className="ListPage__no-stocks-text">
            Feels a little empty in here...
          </span>
          <span className="ListPage__no-stocks-subtext">
            Search for companies to add and stay up to date.
          </span>
        </div>
      ) : (
        <table className="stocks__table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>Name</th>
              <th onClick={() => handleSort("symbol")}>Symbol</th>
              <th onClick={() => handleSort("current_price")}>Price</th>
              <th onClick={() => handleSort("todays_change_percent")}>Today</th>
              <th onClick={() => handleSort("market_cap")}>Market Cap</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="stocks__table-body">
            {sortedStocks ? (
              sortedStocks?.map((stock) => {
                return (
                  <ListPageStockTableItem
                    stock={stock}
                    key={stock.id}
                    navigate={navigate}
                    stocks={stocks}
                    listId={listId}
                  />
                );
              })
            ) : (
              <div className="Stocks-loading-spinner">
                <LoadingSpinner />
              </div>
            )}

            <tr className="stock-row"></tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListPageStockTable;
