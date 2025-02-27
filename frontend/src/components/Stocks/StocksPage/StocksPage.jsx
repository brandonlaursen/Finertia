import "./StocksPage.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useNavigate } from "react-router-dom";

import { fetchAllStocks, selectStocksArray } from "../../../../store/stocks";

import ListContainer from "../../List/ListContainer";
import StocksTable from "../StocksTable/StocksTable";
import NotificationPopUp from "../../NotificationPopUp/NotificationPopUp";

function StocksPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { scrolled } = useOutletContext();

  const stocks = useSelector(selectStocksArray);

  const [sortedStocks, setSortedStocks] = useState(stocks);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);


  useEffect(() => {
    dispatch(fetchAllStocks());
  }, [dispatch]);

  useEffect(() => {
    if (stocks && stocks.length > 0) {
      setSortedStocks(stocks);
    }
  }, [stocks]);

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

  if (!stocks) return <h1>Loading</h1>;

  return (
    <div className="Stocks">
      <div className="Stocks__banner"/>

      <div className="Stocks__container">
        <main className="Stocks__main">

          <div className="Stocks__section">
            <header
              className={`Stocks__header ${
                scrolled ? "Stocks__hide--header" : ""
              }`}
            >
              <span className="Stocks__title">Daily Movers</span>
              <span className="Stocks__subtitle">
                <IoIosCheckmarkCircle className="green-checkmark" />
                Finertia · {stocks.length} items
              </span>
            </header>

            <div className="Stocks__menu">
              <RiListSettingsLine className="Stocks__settings-icon" />

              <button className="Stocks__follow-button">
                Follow
              </button>
            </div>
          </div>

          <div
            className={`Stocks__description ${
              scrolled ? "Stocks__hide--description" : ""
            }`}
          >
            Explore some of the most popular stocks.
          </div>

          <div className="Stocks__table-container">
            <StocksTable
              stocks={stocks}
              handleSort={handleSort}
              sortedStocks={sortedStocks}
              navigate={navigate}
              setNotifications={setNotifications}
              setNotificationMessage={setNotificationMessage}
              notifications={notifications}
              notificationMessage={notificationMessage}
            />

            <div className="Stocks__disclaimer">
              This list is based on data from one or more third party data
              providers. It is provided for informational purposes only by
              Finertia Financial, LLC., and is not investment advice or a
              recommendation. Investors should consider the characteristics of
              any security they consider purchasing, including the investment
              objectives and unique risk profile of any Exchange Traded Products
              (ETP) and read the ETPs prospectus carefully before investing.
            </div>
          </div>
        </main>

        <ListContainer
          className="List_home-container"
          navigate={navigate}
        />
      </div>
      {notifications && (
        <div className="NotificationPopsContainer">
          <NotificationPopUp
            message={notificationMessage}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </div>
  );
}

export default StocksPage;
