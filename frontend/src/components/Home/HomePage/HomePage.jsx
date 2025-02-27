import "./HomePage.css";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { selectUser } from "../../../../store/session";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import BuyingPowerDropDown from "./BuyingPowerDropDown";
import ListContainer from "../../List/ListContainer";
import HomePageChart from "./HomePageChart/HomePageChart";
import NewsFeed from "../NewsFeed";

import SelectTimeFrame from "../../Stock/SelectTimeFrame/SelectTimeFrame";

function HomePage() {
  const navigate = useNavigate();
  const sessionUser = useSelector(selectUser);

  const { stockSummary } = sessionUser;

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const { oneDayFiveMinAggregates } = stockSummary;

  const first = oneDayFiveMinAggregates[0].y;
  const last = oneDayFiveMinAggregates[oneDayFiveMinAggregates.length - 1].y;

  const percentChange = (((last - first) / first) * 100).toFixed(2);
  const amountChange = (last - first).toFixed(2);

  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner">
              <div className="HomePage__main__user-info">
                <span className={`HomePage__investments`}>
                  ${stockSummary.totalInvestments}
                </span>
                <span className={`HomePage__percent-change`}>
                  {percentChange > 0 ? (
                    <GoTriangleUp className="HomePage__triangleIconUp" />
                  ) : (
                    <GoTriangleDown className="HomePage__triangleIconDown" />
                  )}
                  <span
                    className={`${
                      amountChange < 0
                        ? "negative"
                        : amountChange > 0
                        ? "positive"
                        : ""
                    }`}
                  >
                    ${amountChange}
                  </span>
                  <span
                    className={`${
                      percentChange < 0
                        ? "negative"
                        : percentChange > 0
                        ? "positive"
                        : ""
                    }`}
                  >
                    {`(${percentChange}%) `}
                  </span>
                  <span> Today</span>
                </span>
              </div>
              <div className="HomePage__main__chart-container">
                <HomePageChart
                  stockSummary={stockSummary}
                  selectedTimeFrame={selectedTimeFrame}
                />
                <SelectTimeFrame
                  selectedTimeFrame={selectedTimeFrame}
                  setSelectedTimeFrame={setSelectedTimeFrame}
                />
              </div>

            </div>
       
          </div>
          <BuyingPowerDropDown sessionUser={sessionUser} />
          <NewsFeed />
        </div>

        <ListContainer
          className="List_home-container"
          navigate={navigate}
        />
      </div>
    </div>
  );
}

export default HomePage;
