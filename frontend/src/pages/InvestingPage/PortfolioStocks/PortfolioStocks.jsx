import "./PortfolioStocks.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactApexChart from "react-apexcharts";

function PortfolioStocks({ stockInvestments, stockSummary }) {
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
    colors: ["#00f0A8", "#33FF57"],
    fill: {
      type: "solid",
    },
  });

  return (
    <div className="PortfolioStocks">
      <header className="InvestingPage__header">
        <span className="PortfolioStocks__title">Stocks</span>
      </header>

      <main className="InvestingPage__main">
        {console.log(stocks)}

        <table className="PortfolioStocks__stock-table">
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
                  className="PortfolioStocks__table-item"
                  key={stock.stockId}
                  onClick={() => navigate(`/stocks/${stock?.symbol}`)}
                >
                  <td       className="PortfolioStocks__stock-name">{stock.stockName}</td>
                  <td>{stock.symbol}</td>
                  <td>{stock.sharesOwned.toFixed(2)}</td>
                  <td>${stock.price.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

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

export default PortfolioStocks;
