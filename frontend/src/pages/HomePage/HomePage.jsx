import "./HomePage.css";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageOverview from "./HomePageOverview";
import StockChart from "../../components/StockChart";
import TimeFrameSelector from "../../components/TimeFrameSelector";
import BuyingPowerDropDown from "./BuyingPowerDropDown";
import HomePageNewsFeed from "./HomePageNewsFeed";
import ListSideBar from "../../components/ListSideBar";
import NotificationPopUp from "../../components/NotificationPopUp";
import Skeleton from "../../components/Skeleton";

import { selectUser } from "../../../store/session";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);

  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const { stockSummary } = sessionUser;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timeout); 
  }, []);

  return (
    <div className="HomePage">
      <main className="HomePage__main">
        {isLoading ? (
          <>
            <div className="HomePage__skeleton-overview">
              <Skeleton height="100px" />
            </div>
            <div className="HomePage__skeleton-chart">
              <Skeleton height="350px" />
            </div>
            <div className="HomePage__skeleton-buying-power">
              <Skeleton height="80px" />
            </div>
            <div className="HomePage__skeleton-news">
              <Skeleton height="400px" />
            </div>
          </>
        ) : (
          <>
            <HomePageOverview
              stockData={stockSummary}
              selectedTimeFrame={selectedTimeFrame}
            />
            <StockChart
              stockData={stockSummary}
              selectedTimeFrame={selectedTimeFrame}
            />
            <TimeFrameSelector
              selectedTimeFrame={selectedTimeFrame}
              setSelectedTimeFrame={setSelectedTimeFrame}
            />
            <BuyingPowerDropDown
              sessionUser={sessionUser}
              setNotifications={setNotifications}
              setNotificationMessage={setNotificationMessage}
            />
            <HomePageNewsFeed />
          </>
        )}
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
  );
}

export default HomePage;
