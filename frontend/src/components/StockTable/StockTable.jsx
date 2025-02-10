import "./StockTable.css";
import { FaPlus } from "react-icons/fa6";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import AddToListModal from "../Stock/StockWatchList/AddToListModal/AddToListModal";

import { handleSort, formatNumber } from "../helpers/helpers";
function StockTable({
  stocks,
  sortedStocks,
  setSortedStocks,
  sortCriteria,
  setSortCriteria,
  setModalContent,
  setModalClass,
  sortDirection,
  setSortDirection,
}) {
  const navigate = useNavigate();

  if (!stocks) return <h1>Loading</h1>;

  return (
    <div className="stocks__table-container">
      <table className="stocks__table">
        <thead>
          <tr>
            <th
              onClick={() =>
                handleSort(
                  stocks,
                  setSortedStocks,
                  "name",
                  sortCriteria,
                  setSortCriteria,
                  sortDirection,
                  setSortDirection
                )
              }
            >
              Name
            </th>
            {/* <th onClick={() => handleSort("symbol")}>Symbol</th>
            <th onClick={() => handleSort("current_price")}>Price</th>
            <th onClick={() => handleSort("todays_change_percent")}>Today</th>
            <th onClick={() => handleSort("market_cap")}>Market Cap</th> */}
            <th></th>
          </tr>
        </thead>

        <tbody className="stocks__table-body">
          {sortedStocks.length ? (
            sortedStocks.map((stock) => {
              return (
                <tr
                  key={stock?.id}
                  className="stock-row"
                  onClick={() => navigate(`/stocks/${stock?.symbol}`)}
                >
                  <td>{stock?.name}</td>
                  <td>{stock?.symbol}</td>
                  <td>${stock?.current_price?.toFixed(2)}</td>
                  <td>
                    <span className="stocks-table-arrow-container">
                      {stock?.todays_change_percent > 0 ? (
                        <GoTriangleUp className="triangleIconUp" />
                      ) : (
                        <GoTriangleDown className="triangleIconDown" />
                      )}
                      {stock?.todays_change_percent?.toFixed(2)}%
                    </span>
                  </td>
                  <td>{formatNumber(stock?.market_cap)}</td>
                  <td>
                    <FaPlus
                      className="stocks__btn stocks__btn--add"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalContent(
                          <AddToListModal stock={stock} create={true} />
                        );
                        setModalClass({
                          modal: "AddToListModal",
                          modalBackground: "AddToListModal__background",
                          modalContainer: "AddToListModal__container",
                        });
                      }}
                    />
                  </td>
                </tr>
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
      <div className="stocks__disclaimer">
        This list is based on data from one or more third party data providers.
        It is provided for informational purposes only by Finertia Financial,
        LLC., and is not investment advice or a recommendation. Investors should
        consider the characteristics of any security they consider purchasing,
        including the investment objectives and unique risk profile of any
        Exchange Traded Products (ETP) and read the ETPs prospectus carefully
        before investing.
      </div>
    </div>
  );
}

export default StockTable;
