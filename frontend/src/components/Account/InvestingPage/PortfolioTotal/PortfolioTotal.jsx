import "../InvestingPage.css";

import { useState } from "react";
import ReactApexChart from "react-apexcharts";

function PortfolioTotal({
  total,
  stockPercentage,
  stockInvestments,
  balancePercentage,
  balance,
}) {
  const [currentPoint, setCurrentPoint] = useState(null);

  const series = [stockInvestments, balance];
  const labels = ["Stocks", "Individual Cash"];

  const [options] = useState({
    chart: {
      type: "donut",
      width: 250,
      height: 250,
      events: {
        dataPointMouseEnter: function (event, chartContext, opts) {
          setCurrentPoint({
            value: series[opts.dataPointIndex],
            label: labels[opts.dataPointIndex],
          });
        },
        dataPointMouseLeave: function () {
          setCurrentPoint(null);
        },
      },
    },
    labels: labels,
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "88%",
          background: "transparent",
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (value, { seriesIndex, w }) {
        return "$" + w.config.series[seriesIndex];
      },

      style: {
        fontSize: "16px",
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: ["#00f0A8", "#33FF57"],
    fill: {
      type: "solid",
    },
  });

  return (
    <>
      <div className="InvestingPage__portfolio-section">
        <span className="InvestingPage__portfolio-title">
          Total Portfolio value
        </span>
        <span className="InvestingPage__portfolio-value">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="InvestingPage__section">
        <div className="InvestingPage__section-left">
          <div className="InvestingPage__section-left__main">
            <span className="InvestingPage__section-left__main-title">
              Stocks
            </span>
            <div className="InvestingPage__section-left__main-value-container">
              <span className="InvestingPage__section-left__main-value">
                {stockPercentage.toFixed(2)}%
              </span>
              <span>${stockInvestments.toFixed(2)}</span>
            </div>
          </div>

          <div className="InvestingPage__section-left__main">
            <span className="InvestingPage__section-left__main-title">
              Individual cash
            </span>
            <div className="InvestingPage__section-left__main-value-container">
              <span className="InvestingPage__section-left__main-value">

                {balancePercentage.toFixed(2)}%
              </span>
              <span>${balance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="InvestingPage__section-right">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={options.chart.height}
          />
          <span className="InvestingPage__section-right__value">
            {currentPoint ? (
              <>
                <span>{currentPoint.label}</span>
                <span>${currentPoint.value.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span>Total portfolio value</span>
                <span>${total.toFixed(2)}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

export default PortfolioTotal;
