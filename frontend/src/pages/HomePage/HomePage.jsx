import "./HomePage.css";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import HomePageChart from "./HomePageChart/HomePageChart";
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
  const { oneDayFiveMinAggregates } = stockSummary;

  const { percentChange, amountChange } = useMemo(() => {
    if (!oneDayFiveMinAggregates || oneDayFiveMinAggregates.length < 2) {
      return { percentChange: "0.00", amountChange: "0.00" };
    }

    const first = oneDayFiveMinAggregates[0].y;
    const last = oneDayFiveMinAggregates[oneDayFiveMinAggregates.length - 1].y;

    return {
      percentChange: (((last - first) / first) * 100).toFixed(2),
      amountChange: (last - first).toFixed(2),
    };
  }, [oneDayFiveMinAggregates]);

  return (
    <div className="HomePage">
      <div className="HomePage__body">
        <div className="HomePage__main">
          <div className="HomePage__main__section">
            <div className="HomePage__main__title">Investing</div>
            <div className="HomePage__main__banner">
              <div className="HomePage__main__user-info">
                <span className={`HomePage__investments`}>
                  ${stockSummary?.totalInvestments}
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
                  <span className="HomePage__day"> Today</span>
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

        <ListContainer className="List_home-container" navigate={navigate} />
      </div>
    </div>
  );
}

export default HomePage;
