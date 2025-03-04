import "./HomePage.css";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageOverview from "./HomePageOverview";
import StockChart from "../../components/StockChart";
import SelectTimeFrame from "../../components/TimeFrameSelector";
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

  // Simulate loading state
  setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  return (
    <div className="HomePage">
      <main className="HomePage__main">
        {isLoading ? (
          <>
            <div className="HomePage__skeleton-overview">
              <Skeleton height="60px" />
              {/* <div className="HomePage__skeleton-stats">
                <Skeleton height="40px" width="200px" />
                <Skeleton height="40px" width="200px" />
              </div> */}
            </div>
            <div className="HomePage__skeleton-chart">
              <Skeleton height="350px" />
            </div>
            {/* <div className="HomePage__skeleton-timeframe">
              <Skeleton height="40px" width="300px" />
            </div> */}
            {/* <div className="HomePage__skeleton-buying-power">
              <Skeleton height="40px" width="200px" />
            </div> */}
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
            <SelectTimeFrame
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
