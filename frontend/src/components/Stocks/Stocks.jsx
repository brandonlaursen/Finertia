import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Stocks.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";
import { GoPlus } from "react-icons/go";

import { useEffect } from "react";
import { getAllStocksData } from "../../../store/stocks";

function Stocks() {
  const dispatch = useDispatch();
  const stocks = useSelector((state) => state.stock.allStocks);
  console.log("stocks:", stocks);

  useEffect(() => {
    dispatch(getAllStocksData());
  }, [dispatch]);

  return (
    <div className="stocks">
      <div className="stocks__header"></div>

      <div className="stocks__body">
        <div className="stocks__body-left">
          <div className="stocks__section">
            <div className="stocks__section-header">
              <span className="stocks__title">Daily Movers</span>
              <span className="stocks__subtitle">
                <IoIosCheckmarkCircle className="green-checkmark" />
                Robinhood · 20 items
              </span>
            </div>

            <div className="stocks__actions">
              <RiListSettingsLine className="stocks__btn--settings" />

              <button className="stocks__btn stocks__btn--follow">
                Follow
              </button>
            </div>
          </div>

          <div className="stocks__description">
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
                <tr>
                  <td>UPS</td>
                  <td>UPS</td>
                  <td>$115.27</td>
                  <td>13.83$</td>
                  <td>97.13B</td>
                  <td>
                    <GoPlus className="stocks__btn stocks__btn--add" />
                  </td>
                </tr>
                <tr>
                  <td>UPS</td>
                  <td>UPS</td>
                  <td>$115.27</td>
                  <td>13.83$</td>
                  <td>97.13B</td>
                  <td>
                    <button className="stocks__btn stocks__btn--add">
                      <GoPlus />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="stocks__disclaimer">
            This list is based on data from one or more third-party providers.
            It is provided for informational purposes only by Robinhood
            Financial, LLC., and is not investment advice or a recommendation...
          </div>
        </div>

        <div className="stocks__body-right">
          <div className="stocks__lists">
            <div className="stocks__lists-header">
              <span className="stocks__lists-title">Lists</span>

              <GoPlus className="stocks__btn stocks__btn--add" />
            </div>

            <div className="stocks__list-items">

              
              <Link to="/list1" className="stocks__list-item">
                <div className="stocks__list-content">
                  <span className="stocks__list-icon">💡</span>
                  <span className="stocks__list-name">List Name</span>
                </div>
              </Link>


              <Link to="/list2" className="stocks__list-item">
                <div className="stocks__list-content">
                  <span className="stocks__list-icon">⚡</span>
                  <span className="stocks__list-name">List Name</span>
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
