import "./InvestingPortfolio.css";

import { useState } from "react";

import ReactApexChart from "react-apexcharts";

function InvestingPortfolio({ total = 0, stockInvestments = 0, balance = 0 }) {
  const [currentPoint, setCurrentPoint] = useState(null);

  const safeTotal = Math.max(Number(total), 0);
  const safeStockInvestments = Math.max(Number(stockInvestments), 0);
  const safeBalance = Math.max(Number(balance), 0);

  const safeStockPercentage =
    safeTotal > 0 ? (safeStockInvestments / safeTotal) * 100 : 0;
  const safeBalancePercentage =
    safeTotal > 0 ? (safeBalance / safeTotal) * 100 : 0;

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
        fontSize: "12px",
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: [
      "var(--theme-primary-color)",
      "var(--theme-primary-hover)",
      "var(--theme-primary-hover-light)",
    ],
    fill: {
      type: "solid",
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["var(  --color-background)"],
    },
  });

  return (
    <div className="InvestingPortfolio">
      <header className="InvestingPortfolio__header">
        <span className="InvestingPortfolio__title">Total Portfolio value</span>
        <span className="InvestingPortfolio__sub-title">
          ${safeTotal.toFixed(2)}
        </span>
      </header>

      <main className="InvestingPortfolio__main">
        <section className="InvestingPortfolio__details">
          <div className="InvestingPortfolio__section">
            <span className="InvestingPortfolio__label">Stocks</span>
            <div className="InvestingPortfolio__values">
              <span className="InvestingPortfolio__value">
                {safeStockPercentage.toFixed(2)}%
              </span>
              <span className="InvestingPortfolio__value InvestingPortfolio__value--bolded">
                ${safeStockInvestments.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="InvestingPortfolio__section">
            <span className="InvestingPortfolio__label">Individual cash</span>
            <div className="InvestingPortfolio__values">
              <span className="InvestingPortfolio__value">
                {safeBalancePercentage.toFixed(2)}%
              </span>
              <span className="InvestingPortfolio__value InvestingPortfolio__value--bolded">
                ${safeBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        <section className="InvestingPortfolio__chart-container">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={options.chart.height}
          />
          <span className="InvestingPortfolio__chart-container-value">
            {currentPoint ? (
              <>
                <span>{currentPoint.label}</span>
                <span>${currentPoint.value.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span>Total portfolio value</span>
                <span>${safeTotal.toFixed(2)}</span>
              </>
            )}
          </span>
        </section>
      </main>
    </div>
  );
}

export default InvestingPortfolio;
