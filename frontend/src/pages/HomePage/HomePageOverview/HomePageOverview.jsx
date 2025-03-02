import "./HomepageOverview.css";
import { GoTriangleDown } from "react-icons/go";
import { GoTriangleUp } from "react-icons/go";

import { useMemo } from "react";

function HomePageOverview({ stockSummary }) {
  const { oneDayFiveMinAggregates } = stockSummary;

  const { portfolioPercentChange, portfolioAmountChange } = useMemo(() => {
    if (!oneDayFiveMinAggregates || oneDayFiveMinAggregates.length < 2) {
      return { portfolioPercentChange: "0.00", portfolioAmountChange: "0.00" };
    }

    const firstAggregate = oneDayFiveMinAggregates[0].y;
    const lastAggregate =
      oneDayFiveMinAggregates[oneDayFiveMinAggregates.length - 1].y;

    return {
      portfolioPercentChange: (
        ((lastAggregate - firstAggregate) / firstAggregate) *
        100
      ).toFixed(2),
      portfolioAmountChange: (lastAggregate - firstAggregate).toFixed(2),
    };
  }, [oneDayFiveMinAggregates]);

  return (
    <div className="HomePageOverview">
      <h1 className="HomePageOverview__title">Investing</h1>
      <main className="HomePageOverview__summary">
        <span className="HomePageOverview__total-investments">
          ${stockSummary?.totalInvestments}
        </span>

        <span className="HomePageOverview__portfolio-amount-change">
          {portfolioPercentChange > 0 ? (
            <GoTriangleUp className="HomePageOverview__portfolio-amount-change--positive" />
          ) : (
            <GoTriangleDown className="HomePageOverview__portfolio-amount-change--negative" />
          )}
          <span
            className={`${
              portfolioAmountChange < 0
                ? "negative"
                : portfolioAmountChange > 0
                ? "positive"
                : ""
            }`}
          >
            ${portfolioAmountChange}
          </span>

          <span
            className={`${
              portfolioPercentChange < 0
                ? "negative"
                : portfolioPercentChange > 0
                ? "positive"
                : ""
            }`}
          >
            {`(${portfolioPercentChange}%) `}
          </span>

          <span className="HomePageOverview__subtext"> Today</span>
        </span>
      </main>
    </div>
  );
}

export default HomePageOverview;
