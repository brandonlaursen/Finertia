import "./ListPage.css";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import ListSideBar from "../../components/ListSideBar";
import StocksTable from "../../components/StocksTable";

import ListEditor from "./ListEditor";

import { fetchAllStocks } from "../../../store/stocks";
import { fetchLists } from "../../../store/lists";

import { selectListById } from "../../../store/lists";
import NotificationPopUp from "../../components/NotificationPopUp";

function ListPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const stocks = useSelector((state) => state.stocks.allStocks);
  const list = useSelector((state) => selectListById(state, listId));

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        await dispatch(fetchLists());
        await dispatch(fetchAllStocks());
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (isLoading) return <h1>Loading</h1>;

  if (!list) {
    return (
      <div className="StockPage__stock-not-found">
        <h2>List Not Found</h2>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="ListPage">
      <main className="ListPage__main">
        <ListEditor list={list} listId={listId} navigate={navigate} />
        <div className="ListPage__padding">
          {list.Stocks.length > 0 ? (
            <StocksTable
              stocks={stocks}
              listStocks={list.Stocks}
              navigate={navigate}
              list={list}
              listId={listId}
              setNotifications={setNotifications}
              setNotificationMessage={setNotificationMessage}
              notifications={notifications}
              notificationMessage={notificationMessage}
            />
          ) : (
            <div className="ListPage__no-stocks-container">
              <span className="ListPage__no-stocks-container-text">
                Feels a little empty in here...
              </span>
              <span className="ListPage__no-stocks-container-subtext">
                Search for companies to add and stay up to date.
              </span>
            </div>
          )}
        </div>
      </main>

      <ListSideBar
        navigate={navigate}
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
        showDropdown={false}
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
  );
}

export default ListPage;
