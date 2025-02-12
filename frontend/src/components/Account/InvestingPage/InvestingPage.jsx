import "./InvestingPage.css";

import ReactApexChart from "react-apexcharts";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { selectUser } from "../../../../store/session";
import { fetchStockTransactions } from "../../../../store/transactions";

function InvestingPage() {
  const dispatch = useDispatch();
  const [currentPoint, setCurrentPoint] = useState(null);
  const sessionUser = useSelector(selectUser);

  const series = [70.0, 30.0];
  const labels = ["Stocks", "Individual Cash"];

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

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
    <div className="InvestingPage">
      <div>
        <div className="InvestingPage__body">
          <div className="InvestingPage__portfolio-section">
            <span className="InvestingPage__portfolio-title">
              Total Portfolio value
            </span>
            <span className="InvestingPage__portfolio-value">
              ${sessionUser.balance}
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
                    70%
                  </span>
                  <span>$70.00</span>
                </div>
              </div>

              <div className="InvestingPage__section-left__main">
                <span className="InvestingPage__section-left__main-title">
                  Individual cash
                </span>
                <div className="InvestingPage__section-left__main-value-container">
                  <span className="InvestingPage__section-left__main-value">
                    30%
                  </span>
                  <span>$30.00</span>
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
                    <span>${currentPoint.value}</span>
                  </>
                ) : (
                  <>
                    <span>Total portfolio value</span>
                    <span>$100</span>
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="InvestingPage__stock-section">
            <span className="InvestingPage__stock-section__title">Stocks</span>
          </div>
          {/*  */}
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
                  <tr className="InvestingPage__stock-row">
                    <td>apple</td>
                    <td>AAPL</td>
                    <td>20</td>
                    <td>5</td>
                    <td>200</td>
                    <td>
                      <span className="InvestingPage__stocks-table-arrow-container">
                        12
                      </span>
                    </td>
                    <td>200</td>
                    <td></td>
                  </tr>

                  <tr className="InvestingPage__stock-row"></tr>
                </tbody>
              </table>
            </div>

            <div className="InvestingPage__section-right">
              {" "}
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
                    <span>${currentPoint.value}</span>
                  </>
                ) : (
                  <>
                    <span>Total portfolio value</span>
                    <span>$100</span>
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestingPage;
