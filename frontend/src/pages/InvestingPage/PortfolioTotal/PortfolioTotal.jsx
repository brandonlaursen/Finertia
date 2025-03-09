import "./PortfolioTotal.css";

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
        fontSize: "12px",
      },
    },
    tooltip: {
      enabled: false,
    },
    colors: [
      "#00F0A8", 
      "#00E6A0",
      "#00DA98",
      "#00CF90",
      "#00C488",
      "#00B980",
      "#00AE78",
      "#00A370",
      "#009868",
      "#008E60",
      "#008458",
      "#007A50",
      "#007048",
      "#006640",
      "#005C38",
    ],
    fill: {
      type: "solid",
    },
    stroke: {
      show: true,
      width: 3, // Border thickness
      colors: ["var(  --color-background)"], // Border color (black in this case)
    },
  });

  return (
    <div className="PortfolioTotal">
      <header className="InvestingPage__header">
        <span className="PortfolioTotal__title">Total Portfolio value</span>
        <span className="PortfolioTotal__value">${total.toFixed(2)}</span>
      </header>

      <main className="InvestingPage__main">
        <section className="InvestingPage__section">
          <div className="PortfolioTotal__section">
            <span className="PortfolioTotal__section-title">Stocks</span>
            <div className="PortfolioTotal__section-value-container">
              <span className="PortfolioTotal__section-value">
                {stockPercentage.toFixed(2)}%
              </span>
              <span>${stockInvestments.toFixed(2)}</span>
            </div>
          </div>

          <div className="PortfolioTotal__section">
            <span className="PortfolioTotal__section-title">
              Individual cash
            </span>
            <div className="PortfolioTotal__section-value-container">
              <span className="PortfolioTotal__section-value">
                {balancePercentage.toFixed(2)}%
              </span>
              <span>${balance.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <section className="InvestingPage__chart-container">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={options.chart.height}
          />
          <span className="InvestingPage__chart-container-value">
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
        </section>
      </main>
    </div>
  );
}

export default PortfolioTotal;
