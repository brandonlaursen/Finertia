import "./HomePage.css";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageChart from "./HomePageChart/HomePageChart";
import SelectTimeFrame from "../../components/Stock/SelectTimeFrame";
import BuyingPowerDropDown from "./BuyingPowerDropDown";
import NewsFeed from "../../components/NewsFeed";
import ListContainer from "../../components/List/ListContainer";

import HomePageOverview from "./HomePageOverview/HomePageOverview";

import { selectUser } from "../../../store/session";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const { stockSummary } = sessionUser;


  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <main className="HomePage__main">
          <div className="HomePage__main__section">
            <HomePageOverview
              stockSummary={stockSummary}
            />
            <section className="HomePage__main__chart-container">
              <HomePageChart
                stockSummary={stockSummary}
                selectedTimeFrame={selectedTimeFrame}
              />
              <SelectTimeFrame
                selectedTimeFrame={selectedTimeFrame}
                setSelectedTimeFrame={setSelectedTimeFrame}
              />
            </section>
          </div>
          <BuyingPowerDropDown sessionUser={sessionUser} />
          <NewsFeed />
        </main>

        <aside>
          <ListContainer className="List_home-container" navigate={navigate} />
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
