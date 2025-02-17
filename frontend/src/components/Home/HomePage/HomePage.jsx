import "./HomePage.css";

import { selectUser } from "../../../../store/session";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import BuyingPowerDropDown from "./BuyingPowerDropDown";
import ListContainer from "../../List/ListContainer";
import HomePageChart from "./HomePageChart/HomePageChart";
import NewsFeed from "../NewsFeed";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);

  const { stockSummary } = sessionUser;
  const stockInvestments = Object.values(stockSummary).reduce(
    (total, stock) => (total += stock.averageCost * stock.sharesOwned),
    0
  );

  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner">
              <div className="HomePage__main__user-info">
                <span>${stockInvestments.toFixed(2)}</span>
              </div>
              <div className="HomePage__main__chart-container">
                <HomePageChart />
              </div>
              <BuyingPowerDropDown sessionUser={sessionUser} />
            </div>
            <div className="HomePage__main__subtitle">Welcome to Finertia</div>
          </div>

          <NewsFeed />
        </div>

        <ListContainer
          className="WatchList-HomePage-container"
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default HomePage;
