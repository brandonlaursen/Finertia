import "./HomePage.css";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageOverview from "./HomePageOverview";
import StockChart from "../../components/StockChart";
import TimeFrameSelector from "../../components/TimeFrameSelector";
import BuyingPowerDropDown from "./HomePageBuyingPower";
import HomePageNewsFeed from "./HomePageNewsFeed";
import ListSideBar from "../../components/ListSideBar";
import NotificationPopUp from "../../components/NotificationPopUp";
import HomePageSkeleton from "./HomePageSkeleton";

import { selectUser } from "../../../store/session";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);

  const { stockSummary } = sessionUser;
  console.log(" stockSummary:", stockSummary, sessionUser);

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

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
          <HomePageSkeleton />
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
