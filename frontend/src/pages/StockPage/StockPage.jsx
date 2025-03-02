import "./StockPage.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockOverview from "./StockOverview";
import StockChart from "../../components/StockChart";
import SelectTimeFrame from "../../components/SelectTimeFrame";
import StockDetails from "./StockDetails";
import StockNews from "./StockNews";

import StockTradeSidebar from "../../components/StockTradeSideBar/StockTradeSidebar";
import NotificationPopUp from "../../components/NotificationPopUp";
import LoadingSpinner from "../../components/LoadingSpinner";

import { fetchStock } from "../../../store/stocks";

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

  if (isLoading)
    return (
      <div className="StockPage__loading-spinner">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="StockPage">
      <main className="StockPage__main">
        <StockOverview stock={stock} />
        <StockChart selectedTimeFrame={selectedTimeFrame} stockData={stock} />
        <SelectTimeFrame
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
        <StockDetails stock={stock} />
        <StockNews stockNews={stock.news} />
      </main>

      <StockTradeSidebar
        stock={stock}
        setNotifications={setNotifications}
        setNotificationMessage={setNotificationMessage}
        notifications={notifications}
        notificationMessage={notificationMessage}
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

export default StockPage;
