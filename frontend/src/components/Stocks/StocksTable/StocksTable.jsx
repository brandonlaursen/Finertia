import "./StocksTable.css";

import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import StocksTableItem from "../StocksTableItem/StocksTableItem";

function StocksTable({ stocks, handleSort, sortedStocks, navigate, setNotifications, setNotificationMessage }) {
  return (
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
        {stocks.length ? (
          sortedStocks.map((stock) => {
            return (
              <StocksTableItem
                key={stock.id}
                stock={stock}
                navigate={navigate}
                setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
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
  );
}

export default StocksTable;
