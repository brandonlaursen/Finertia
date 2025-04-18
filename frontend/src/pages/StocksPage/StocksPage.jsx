import "./StocksPage.css";
import { IoIosCheckmarkCircle } from "react-icons/io";
// import { RiListSettingsLine } from "react-icons/ri";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext, useNavigate } from "react-router-dom";

import { fetchAllStocks, selectStocksArray } from "../../../store/stocks";

import ListSideBar from "../../components/ListSideBar";
import StocksTable from "../../components/StocksTable";
import NotificationPopUp from "../../components/NotificationPopUp/NotificationPopUp";

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

  return (
    <div className="StocksPage">
      <div className="StocksPage__banner" />

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

            {/* <div className="StocksPage__menu">
              <RiListSettingsLine className="StocksPage__settings-icon" />

              <button className="StocksPage__follow-button">Follow</button>
            </div> */}
          </section>

          <section
            className={`StocksPage__description ${
              scrolled ? "StocksPage__hide--description" : ""
            }`}
          >
            Explore all the available stocks.
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
        </main>

        <ListSideBar
          navigate={navigate}
          setNotifications={setNotifications}
          setNotificationMessage={setNotificationMessage}
        />
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
