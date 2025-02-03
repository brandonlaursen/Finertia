import { useDispatch, useSelector } from "react-redux";
import { Link, useOutletContext } from "react-router-dom";
import "./Stocks.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";

import { useEffect } from "react";
import { fetchAllStocks } from "../../../store/stocks";

function Stocks() {
  const { scrolled } = useOutletContext();

  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.allStocks);

  useEffect(() => {
    dispatch(fetchAllStocks());
  }, [dispatch]);

  // if(stocks)

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
                Finertia · 20 items
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
            Hot off the press. See the 20 companies with the biggest swing in
            stock price today.
          </div>

          <div className="stocks__table-container">
            <table className="stocks__table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Symbol</th>
                  <th>Price</th>
                  <th>Today</th>
                  <th>Market Cap</th>
                  <th></th>
                </tr>
              </thead>
              <tbody className="stocks__table-body">
                {stocks &&
                  stocks?.result?.body.map((stock) => {
                    return (
                      <tr key={stock.symbol} className="stock-row">
                        <td>{stock.displayName}</td>
                        <td>{stock.symbol}</td>
                        <td>${stock.ask}</td>
                        <td>{stock.symbol}</td>
                        <td>{stock.marketCap}</td>
                        <td>
                          <FaPlus className="stocks__btn stocks__btn--add" />
                        </td>
                      </tr>
                    );
                  })}
                {stocks?.result?.body &&
                  stocks?.result?.body.map((stock) => {
                    return (
                      <tr key={stock.symbol} className="stock-row">
                        <td>{stock.displayName}</td>
                        <td>{stock.symbol}</td>
                        <td>${stock.ask}</td>
                        <td>{stock.symbol}</td>
                        <td>{stock.marketCap}</td>
                        <td>
                          <FaPlus className="stocks__btn stocks__btn--add" />
                        </td>
                      </tr>
                    );
                  })}
                {stocks?.result?.body &&
                  stocks?.result?.body.map((stock) => {
                    return (
                      <tr key={stock.symbol} className="stock-row">
                        <td>{stock.displayName}</td>
                        <td>{stock.symbol}</td>
                        <td>${stock.ask}</td>
                        <td>{stock.symbol}</td>
                        <td>{stock.marketCap}</td>
                        <td>
                          <FaPlus className="stocks__btn stocks__btn--add" />
                        </td>
                      </tr>
                    );
                  })}
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

        <div className="stocks__body-right">
          <div className="stocks__lists">
            <div className="stocks__lists-header">
              <span className="stocks__lists-title">Lists</span>

              <FaPlus className="stocks__btn stocks__btn--add" />
            </div>

            <div className="stocks__list-items">
              <Link to="/list1" className="stocks__list-item">
                <div className="stocks__list-content">
                  <span className="stocks__list-icon">💡</span>
                  <span className="stocks__list-name">My First List</span>
                </div>
              </Link>

              <Link to="/list2" className="stocks__list-item">
                <div className="stocks__list-content">
                  <span className="stocks__list-icon">⚡</span>
                  <span className="stocks__list-name">Stocks to Watch</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Stocks;
