import "./StockPage.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockOverview from "./StockOverview";
import StockChart from "../../components/StockChart";
import SelectTimeFrame from "../../components/TimeFrameSelector";
import StockDetails from "./StockDetails";
import StockNews from "./StockNews";
import Skeleton from "../../components/Skeleton/Skeleton";
import StockTradeSidebar from "../../components/StockTradeSideBar/StockTradeSidebar";
import NotificationPopUp from "../../components/NotificationPopUp";
import StockNotFound from "./StockNotFound";
import MobileStockTradeSideBar from "../../components/MobileStockTradeSideBar";
import StockPageSkeleton from "./StockPageSkeleton";

import { fetchStock } from "../../../store/stocks";

function StockPage() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const stock = useSelector((state) => state.stocks.currentStock);

  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");
  const [showStockTradeSideBar, setShowStockTradeSideBar] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        await dispatch(fetchStock(stockSymbol));
      } catch (err) {
        setError("Stock not found");
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [stockSymbol, dispatch]);

  if (error) {
    return <StockNotFound stockSymbol={stockSymbol} />;
  }

  return (
    <div className="StockPage">
      <main className="StockPage__main">
        {isLoading ? (
          <StockPageSkeleton />
        ) : (
          <>
            <StockOverview
              stock={stock}
              selectedTimeFrame={selectedTimeFrame}
            />
            <StockChart
              selectedTimeFrame={selectedTimeFrame}
              stockData={stock}
            />
            <SelectTimeFrame
              selectedTimeFrame={selectedTimeFrame}
              setSelectedTimeFrame={setSelectedTimeFrame}
            />
            <StockDetails stock={stock} />
            <StockNews stockNews={stock.news} />
          </>
        )}
      </main>

      {isLoading ? (
        <div className="StockTrade__sidebar-skeleton">
          <Skeleton height="100%" />
        </div>
      ) : (
        <>
          <StockTradeSidebar
            stock={stock}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
            notifications={notifications}
            notificationMessage={notificationMessage}
          />

          <MobileStockTradeSideBar
            stock={stock}
            setNotifications={setNotifications}
            setNotificationMessage={setNotificationMessage}
            notifications={notifications}
            notificationMessage={notificationMessage}
            showStockTradeSideBar={showStockTradeSideBar}
            setShowStockTradeSideBar={setShowStockTradeSideBar}
          />
        </>
      )}

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
