import "./ListPageStockTableItem.css";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";
import { MdClose } from "react-icons/md";

import { useDispatch } from "react-redux";

import { editListStocks } from "../../../../store/stocks";

function ListPageStockTableItem({ stock, stocks, navigate, listId }) {
  const dispatch = useDispatch();

  const { id, stockName, stockSymbol } = stock;
  const stockInfo = stocks[id];

  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  return (
    <tr
      className="StockTableItem"
      onClick={() => navigate(`/stocks/${stockSymbol}`)}
    >
      <td>{stockName}</td>
      <td>{stockSymbol}</td>
      <td>${stockInfo?.current_price?.toFixed(2)}</td>
      <td>
        <span className="stocks-table-arrow-container">
          {stockInfo?.todays_change_percent > 0 ? (
            <GoTriangleUp className="triangleIconUp" />
          ) : (
            <GoTriangleDown className="triangleIconDown" />
          )}
          {stockInfo?.todays_change_percent?.toFixed(2)}%
        </span>
      </td>
      <td>{formatNumber(stockInfo?.market_cap)}</td>
      <td>
        <MdClose
          className="ListPage__delete"
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();

            const id = Number(listId);
            await dispatch(editListStocks({ [id]: false }, stock));
          }}
        />
      </td>
    </tr>
  );
}

export default ListPageStockTableItem;
