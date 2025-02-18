import "./StockPage.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import StockHeader from "../StockHeader/StockHeader";
import SelectTimeFrame from "../SelectTimeFrame/SelectTimeFrame";
import StockChart from "../StockChart";
import StockInfo from "../StockInfo";
import StockNews from "../StockNews";
import StockWatchList from "../StockWatchList";

import NotificationPopUp from "../../NotificationPopUp/NotificationPopUp";

import { fetchStock } from "../../../../store/stocks";

function StockPage() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const stock = useSelector((state) => state.stocks.currentStock);

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      await dispatch(fetchStock(stockSymbol));
      if (isMounted) {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [stockSymbol, dispatch, isLoading]);

  return (
    <>
      <div className="StockPage">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="StockPage__body">
            <div className="StockPage__body__main">
              <StockHeader stock={stock} />
              <StockChart selectedTimeFrame={selectedTimeFrame} stock={stock} />
              <SelectTimeFrame
                selectedTimeFrame={selectedTimeFrame}
                setSelectedTimeFrame={setSelectedTimeFrame}
              />
              <StockInfo stock={stock} />
              <StockNews stockNews={stock.news} />
            </div>

            <StockWatchList
              stock={stock}
              setNotifications={setNotifications}
              setNotificationMessage={setNotificationMessage}
              notifications={notifications}
              notificationMessage={notificationMessage}
            />
          </div>
        )}
      </div>


      {notifications && (
        <div className="NotificationPopsContainer">
          <NotificationPopUp
            message={notificationMessage}
            setNotifications={setNotifications}
          />
        </div>
      )}
    </>
  );
}

export default StockPage;
