import "./HomepageOverview.css";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { useMemo } from "react";

function HomePageOverview({ stockData, selectedTimeFrame }) {
  const {
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  } = stockData;

  console.log(
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates
  );
  const data = useMemo(() => {
    const aggregatesMap = {
      "1D": oneDayAggregates,
      "1W": oneWeekAggregates,
      "1M": oneMonthAggregates,
      "3M": threeMonthsAggregates,
      "1Y": oneYearAggregates,
      "5Y": fiveYearsAggregates,
    };

    return aggregatesMap[selectedTimeFrame] || [];
  }, [
    selectedTimeFrame,
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  ]);

  const { portfolioPercentChange, portfolioAmountChange } = useMemo(() => {
    if (!Array.isArray(data) || data.length < 2) {
      return { portfolioPercentChange: 0.0, portfolioAmountChange: 0.0 };
    }

    const firstAggregate = Number(data[0]?.y) || 0;
    console.log(" firstAggregate:", firstAggregate);
    const lastAggregate = Number(data[data.length - 1]?.y) || 0;
    console.log(" lastAggregate:", lastAggregate);

    const amountChange = lastAggregate - firstAggregate;

    let percentChange;

    if (firstAggregate === 0) {
      percentChange = lastAggregate !== 0 ? 100.0 : 0.0; // If first value is 0, assume full growth
    } else {
      percentChange = (amountChange / firstAggregate) * 100;
    }

    return {
      portfolioPercentChange: isFinite(percentChange) ? percentChange : 0.0,
      portfolioAmountChange: isFinite(amountChange) ? amountChange : 0.0,
    };
  }, [data]);

  console.log(portfolioPercentChange, portfolioAmountChange);

  return (
    <div className="HomePageOverview">
      <h1 className="HomePageOverview__title">Investing</h1>
      <main className="HomePageOverview__main">
        <span className="HomePageOverview__total-investments">
          ${stockData.totalInvestments || 0}
        </span>

        <span className="HomePageOverview__portfolio-amount-change">
          {portfolioPercentChange >= 0 ? (
            <GoTriangleUp className="HomePageOverview__portfolio-amount-change--positive" />
          ) : (
            <GoTriangleDown className="HomePageOverview__portfolio-amount-change--negative" />
          )}
          <span
            className={`${
              portfolioAmountChange < 0
                ? "negative"
                : portfolioAmountChange >= 0
                ? "positive"
                : ""
            }`}
          >
            {portfolioAmountChange < 0
              ? ""
              : portfolioAmountChange > 0
              ? "+"
              : ""}
            ${portfolioAmountChange.toFixed(2)}
          </span>

          <span
            className={`${
              portfolioPercentChange < 0
                ? "negative"
                : portfolioPercentChange >= 0
                ? "positive"
                : ""
            }`}
          >
            {`(${
              portfolioPercentChange < 0
                ? ""
                : portfolioPercentChange > 0
                ? "+"
                : ""
            }${portfolioPercentChange.toFixed(2)}%) `}
          </span>

          <span className="HomePageOverview__subtext">
            {selectedTimeFrame === "1D"
              ? "Today"
              : selectedTimeFrame === "1W"
              ? "Past week"
              : selectedTimeFrame === "1M"
              ? "Past month"
              : selectedTimeFrame === "3M"
              ? "Past 3 months"
              : selectedTimeFrame === "1Y"
              ? "Past year"
              : selectedTimeFrame === "5Y"
              ? "Past 5 years"
              : "This year"}
          </span>
        </span>
      </main>
    </div>
  );
}

export default HomePageOverview;
