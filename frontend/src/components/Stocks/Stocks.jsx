import "./Stocks.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";

import WatchList from "../WatchList";

import { fetchAllStocks } from "../../../store/stocks";

import { useNavigate } from "react-router-dom";

import { selectStocksArray } from "../../../store/stocks";

import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import AddToListModal from "../Stock/StockWatchList/AddToListModal/AddToListModal";
import { useModal } from "../../context/Modal";

function Stocks() {
  const { scrolled } = useOutletContext();
  const navigate = useNavigate();
  const { setModalContent, setModalClass } = useModal();

  const dispatch = useDispatch();
  const stocks = useSelector(selectStocksArray);

  const [sortedStocks, setSortedStocks] = useState(stocks);

  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleSort = (criteria) => {
    let sortedData = [...stocks];

    const newDirection =
      criteria === sortCriteria && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);

    if (criteria === "name") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    } else if (criteria === "symbol") {
      sortedData.sort((a, b) =>
        newDirection === "asc"
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol)
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

  useEffect(() => {
    dispatch(fetchAllStocks());
  }, [dispatch]);

  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  useEffect(() => {
    // Set sortedStocks when stocks are available
    if (stocks && stocks.length > 0) {
      setSortedStocks(stocks);
    }
  }, [stocks]);

  if (!stocks) return <h1>Loading</h1>;

  return (
    <div className="stocks">
      <div className="stocks__header"></div>

      <div className="stocks__body">
        <div className="stocks__body-left">
          <div className="stocks__section">
            <div
              className={`stocks__section-header ${
                scrolled ? "stock__hide--header" : ""
              }`}
            >
              <span className="stocks__title">Daily Movers</span>
              <span className="stocks__subtitle">
                <IoIosCheckmarkCircle className="green-checkmark" />
                Finertia · {stocks.length} items
              </span>
            </div>

            <div className="stocks__actions">
              <RiListSettingsLine className="stocks__btn--settings" />

              <button className="stocks__btn stocks__btn--follow">
                Follow
              </button>
            </div>
          </div>

          <div
            className={`stocks__description ${
              scrolled ? "stock__hide--description" : ""
            }`}
          >
            Explore some of the most popular stocks.
          </div>

          <div className="stocks__table-container">
            <table className="stocks__table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("name")}>Name</th>
                  <th onClick={() => handleSort("symbol")}>Symbol</th>
                  <th onClick={() => handleSort("current_price")}>Price</th>
                  <th onClick={() => handleSort("todays_change_percent")}>
                    Today
                  </th>
                  <th onClick={() => handleSort("market_cap")}>Market Cap</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="stocks__table-body">
                {stocks.length ? (
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
              This list is based on data from one or more third party data
              providers. It is provided for informational purposes only by
              Finertia Financial, LLC., and is not investment advice or a
              recommendation. Investors should consider the characteristics of
              any security they consider purchasing, including the investment
              objectives and unique risk profile of any Exchange Traded Products
              (ETP) and read the ETPs prospectus carefully before investing.
            </div>
          </div>
        </div>

        <WatchList className="WatchList-Stocks-container" />
      </div>
    </div>
  );
}

export default Stocks;
