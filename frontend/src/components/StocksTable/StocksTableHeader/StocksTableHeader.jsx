import "./StocksTableHeader.css";

function StocksTableHeader({ handleSortClick, getSortIcon }) {
  return (
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
  );
}

export default StocksTableHeader;
