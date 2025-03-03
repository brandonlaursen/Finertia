import "./StocksPage.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RiListSettingsLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useNavigate } from "react-router-dom";

import { fetchAllStocks, selectStocksArray } from "../../../store/stocks";

import ListContainer from "../../components/List/ListContainer";
import StocksTable from "../../components/StocksTable";
import NotificationPopUp from "../../components/NotificationPopUp/NotificationPopUp";
import LoadingSpinner from "../../components/LoadingSpinner";

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

  if (!stocks) return <LoadingSpinner />;

  return (
    <div className="StocksPage">
      <div className="StocksPage__banner" />

      {/* home page equivalent */}
      <div className="StocksPage__container">
        <main className="StocksPage__main">
          <section className="StocksPage__section">
            <header
              className={`StocksPage__header ${
                scrolled ? "StocksPage__hide--header" : ""
              }`}
            >
              <span className="StocksPage__title">Daily Movers</span>
              <span className="StocksPage__subtitle">
                <IoIosCheckmarkCircle className="StocksPage__check-mark-icon" />
                Finertia · {stocks.length} items
              </span>
            </header>

            <div className="StocksPage__menu">
              <RiListSettingsLine className="StocksPage__settings-icon" />

              <button className="StocksPage__follow-button">Follow</button>
            </div>
          </section>

          <section
            className={`StocksPage__description ${
              scrolled ? "StocksPage__hide--description" : ""
            }`}
          >
            Explore some of the most popular stocks.
          </section>

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

          <div className="StocksPage__disclaimer">
            This list is based on data from one or more third party data
            providers. It is provided for informational purposes only by
            Finertia Financial, LLC., and is not investment advice or a
            recommendation. Investors should consider the characteristics of any
            security they consider purchasing, including the investment
            objectives and unique risk profile of any Exchange Traded Products
            (ETP) and read the ETPs prospectus carefully before investing.
          </div>
        </main>

        <ListContainer className="List_home-container" navigate={navigate} />
        {notifications && (
          <div className="NotificationPopsContainer">
            <NotificationPopUp
              message={notificationMessage}
              setNotifications={setNotifications}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StocksPage;
