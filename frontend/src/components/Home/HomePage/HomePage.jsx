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

  console.log(stockSummary)

  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner">
              <div className="HomePage__main__user-info">
                <span>${stockSummary.totalInvestments}</span>
              </div>
              <div className="HomePage__main__chart-container">
                <HomePageChart stockSummary={stockSummary}/>
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
