import "./HomePage.css";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageOverview from "./HomePageOverview";
import StockChart from "../../components/Stock/StockChart";
import SelectTimeFrame from "../../components/Stock/SelectTimeFrame";
import BuyingPowerDropDown from "./BuyingPowerDropDown";
import NewsFeed from "../../components/NewsFeed";
import ListContainer from "../../components/List/ListContainer";

import { selectUser } from "../../../store/session";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const { stockSummary } = sessionUser;

  return (
    <div className="HomePage">
      <main className="HomePage__main">
        <HomePageOverview stockSummary={stockSummary} />

        <StockChart
          stockData={stockSummary}
          selectedTimeFrame={selectedTimeFrame}
        />

        <SelectTimeFrame
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
        />
        <BuyingPowerDropDown sessionUser={sessionUser} />
        <NewsFeed />
      </main>

      <aside className="HomePage__aside">
        <ListContainer className="List_home-container" navigate={navigate} />
      </aside>
    </div>
  );
}

export default HomePage;
