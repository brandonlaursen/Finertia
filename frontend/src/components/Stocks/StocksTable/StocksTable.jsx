import "./StocksTable.css";

import { useMemo } from "react";

import StocksTableItem from "../StocksTableItem/StocksTableItem";
import LoadingSpinner from "../../LoadingSpinner";

function StocksTable({
  stocks,
  listStocks = null,
  handleSort,
  navigate,
  setNotifications,
  setNotificationMessage,
  listId = null,
}) {
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
  console.log(stocksData);

  return (
    <table className="StocksTable">
      <thead className="StocksTable__head">
        <tr>
          <th onClick={() => handleSort("name")} className="StocksTable__name">
            Name
          </th>
          <th onClick={() => handleSort("symbol")}>Symbol</th>
          <th onClick={() => handleSort("current_price")}>Price</th>
          <th onClick={() => handleSort("todays_change_percent")}>Today</th>
          <th onClick={() => handleSort("market_cap")}>Market Cap</th>
          <th></th>
        </tr>
      </thead>

      {stocksData.length ? (
        <tbody className="StocksTable__body">
          {stocksData.map((stock) => {
            return (
              <StocksTableItem
                key={stock.id}
                stock={stock}
                navigate={navigate}
                setNotifications={setNotifications}
                setNotificationMessage={setNotificationMessage}
                listStocks={listStocks}
                listId={listId}
              />
            );
          })}

          {!listStocks && <tr className="StockTableItem"></tr>}
        </tbody>
      ) : (
        <div className="Stocks-loading-spinner">
          <LoadingSpinner />
        </div>
      )}
    </table>
  );
}

export default StocksTable;
