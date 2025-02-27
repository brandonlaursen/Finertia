import "../InvestingPage.css";

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
    <>
      <div className="InvestingPage__stock-section">
        <span className="InvestingPage__stock-section__title">Stocks</span>
      </div>

      <div className="InvestingPage__section">
        <div className="InvestingPage__section-left">
          <table className="InvestingPage__stocks__table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Average Cost</th>
              </tr>
            </thead>
            <tbody className="InvestingPage__stocks__table-body">
              {Object.values(stocks).map((stock) => {
                return (
                  <tr
                    className="InvestingPage__StockTableItem"
                    key={stock.stockId}
                    onClick={() => navigate(`/stocks/${stock?.symbol}`)}
                  >
                    <td>{stock.stockName}</td>
                    <td>{stock.symbol}</td>
                    <td>{stock.sharesOwned.toFixed(2)}</td>
                    <td>-</td>
                    <td>${stock.price.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
                <span>Stocks</span>
                <span>${stockInvestments?.toFixed(2)}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

export default PortfolioStocks;
