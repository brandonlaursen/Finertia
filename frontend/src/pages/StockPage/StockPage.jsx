import "./StockPage.css";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockOverview from "./StockOverview";
import StockChart from "../../components/StockChart";
import SelectTimeFrame from "../../components/TimeFrameSelector";
import StockDetails from "./StockDetails";
import StockNews from "./StockNews";
import Skeleton from "../../components/Skeleton/Skeleton";

import StockTradeSidebar from "../../components/StockTradeSideBar/StockTradeSidebar";
import NotificationPopUp from "../../components/NotificationPopUp";

import { fetchStock } from "../../../store/stocks";

function StockPage() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();
  const navigate = useNavigate();
  const stock = useSelector((state) => state.stocks.currentStock);

  const [error, setError] = useState(null);
  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

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
    return (
      <div className="StockPage__stock-not-found">
        <h2>Stock Not Found</h2>
        <p>The stock symbol {`"${stockSymbol}"`} not found.</p>
        <button onClick={() => navigate("/")}>Return to Home</button>
      </div>
    );
  }

  return (
    <div className="StockPage">
      <main className="StockPage__main">
        {isLoading ? (
          <>
            <div className="StockPage__skeleton-overview">
              <Skeleton height="100px" />
            </div>
            <div className="StockPage__skeleton-chart">
              <Skeleton height="350px" />
            </div>
            <div className="StockPage__skeleton-details">
              <Skeleton height="200px" />
            </div>
            <div className="StockPage__skeleton-news">
              <Skeleton height="400px" />
            </div>
          </>
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
