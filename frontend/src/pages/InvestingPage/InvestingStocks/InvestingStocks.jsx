import "./InvestingStocks.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactApexChart from "react-apexcharts";

function InvestingStocks({ stockInvestments, stockSummary }) {
  const navigate = useNavigate();
  const [currentPoint, setCurrentPoint] = useState(null);

  const stocks = stockSummary.stocksOwned;

  const stockSymbols = Object.keys(stocks);
  const stockHoldings = [];

  for (let stockSymbol in stocks) {
    const { sharesOwned, price } = stocks[stockSymbol];
    const total = (sharesOwned * price).toFixed(2);

    stockHoldings.push(Number(total));
  }

  const series = stockHoldings;
  const labels = stockSymbols;

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

      style: {
        fontSize: "16px",
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
    <div className="InvestingStocks">
      <header className="InvestingStocks__header">
        <span className="InvestingStocks__title">Stocks</span>
      </header>

      <main className="InvestingStocks__main">
        <table className="InvestingStocks__stock-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Symbol</th>
              <th>Shares</th>

              <th>Average Cost</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(stocks).map((stock) => {
              return (
                <tr
                  className="InvestingStocks__table-item"
                  key={stock.stockId}
                  onClick={() => navigate(`/stocks/${stock?.symbol}`)}
                >
                  <td>{stock.stockName}</td>
                  <td>{stock.symbol}</td>
                  <td>{stock.sharesOwned.toFixed(2)}</td>
                  <td>${stock.price.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <section className="InvestingStocks__chart-container">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={options.chart.height}
          />
          <span className="InvestingStocks__chart-container-value">
            {currentPoint ? (
              <>
                <span>{currentPoint.label}</span>
                <span>${currentPoint.value.toFixed(2)}</span>
              </>
            ) : (
              <>
                <span>Stocks</span>
                <span>${stockInvestments?.toFixed(2)}</span>
              </>
            )}
          </span>
        </section>
      </main>
    </div>
  );
}

export default InvestingStocks;
