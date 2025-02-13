import "./InvestingPage.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ReactApexChart from "react-apexcharts";

function PortfolioStocks({ stockInvestments, stockSummary }) {
  const navigate = useNavigate();
  const [currentPoint, setCurrentPoint] = useState(null);

  const stockSymbols = Object.keys(stockSummary);

  const stockHoldings = stockSymbols.map((stockSymbol) => {
    const currentStock = stockSummary[stockSymbol];
    const { sharesOwned, averageCost } = currentStock;
    const total = (sharesOwned * averageCost).toFixed(2);
    return Number(total);
  });

  const series = stockHoldings;
  console.log("series:", series);
  const labels = stockSymbols;
  console.log("labels:", labels);

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
                <th>Total Return</th>
                <th>Equity</th>
              </tr>
            </thead>
            <tbody className="InvestingPage__stocks__table-body">
              {Object.values(stockSummary).map((stock) => {
                return (
                  <tr
                    className="InvestingPage__stock-row"
                    key={stock.stockId}
                    onClick={() => navigate(`/stocks/${stock?.stockSymbol}`)}
                  >
                    <td>{stock.stockName}</td>
                    <td>{stock.stockSymbol}</td>
                    <td>{stock.sharesOwned.toFixed(2)}</td>
                    <td>-</td>
                    <td>${stock.averageCost.toFixed(2)}</td>
                    <td>
                      <span className="InvestingPage__stocks-table-arrow-container">
                        12
                      </span>
                    </td>
                    <td>200</td>
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
                <span>{currentPoint.value}</span>
                <span>${currentPoint.label}</span>
                <span className="InvestingPage__section-right__value-shares">
                  {`${stockSummary[currentPoint.value].sharesOwned.toFixed(
                    2
                  )} Shares`}
                </span>
              </>
            ) : (
              <>
                <span>Stocks</span>
                <span>${stockInvestments.toFixed(2)}</span>
              </>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

export default PortfolioStocks;
