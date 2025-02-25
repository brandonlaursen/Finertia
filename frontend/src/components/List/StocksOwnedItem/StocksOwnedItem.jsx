import "./StocksOwnedItem.css";

import { useState } from "react";
import ReactApexChart from "react-apexcharts";


function StocksOwnedItem({ stock, navigate, stocks }) {
  const { symbol, sharesOwned } = stock;

  console.log("asdfasdfsadf", stocks);
  const stockInfo = Object.values(stocks).find(
    (stock) => stock.symbol === symbol
  );

  const { o, h, c } = stockInfo.day;
  console.log({ o, h, c });

  const mediumValue = (o + h + c) / 3
  console.log(" mediumValue:", mediumValue);
  const data = [{x:1,y:o}, {x:2,y:h}, {x:3, y:c}];

  const series = [
    {
      name: "Price",
      data,
    },
  ];


  const [options] = useState({

    chart: {
      type: "line",
      height: 10,
      width: 40,
      zoom: {
        enabled: false,
      },
      sparkline: { enabled: true },
    },
    // colors: ["#00E396"],
    colors: [c < o ? "#FF4560" : "#00E396"],
    stroke: { width: 1, curve: "straight" },
    // plotOptions: {
    //   line: {
    //     colors: {
    //       threshold: mediumValue,
    //       colorAboveThreshold: 'green',
    //       colorBelowThreshold: 'red',
    //     },
    //   },
    // },
    annotations: {
      yaxis: [
        {
          y: mediumValue,
          borderColor: "grey",
          borderWidth: .5,
          strokeDashArray: "1, 1",
        },
      ],
    },
    tooltip: {
     enabled:false
    },
  });


  return (
    <div
      className="WatchListStocks__container"
      key={stockInfo?.id}
      onClick={() => navigate(`/stocks/${stockInfo?.symbol}`)}
    >
      <div className="WatchListStocks__container-title-shares">
        <span className="WatchListStocks__container-title">
          {stockInfo?.symbol}
        </span>
        <span className="StocksOwnedItem__container-subtitle">
          {sharesOwned?.toFixed(5) ? `${sharesOwned?.toFixed(5)} Shares` : ""}
        </span>
      </div>
      <span className="WatchListStocks__container-graph">
        {" "}
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={10}
          width={80}
        />
      </span>
      <span className="WatchListStocks__container-data">
        <span className={`WatchListStocks__container-price`}>
          ${stockInfo?.current_price.toFixed(2)}
        </span>
        <span
          className={`WatchListStocks__container-percent ${
            stockInfo?.todays_change_percent.toFixed(2) > 0
              ? "WatchListStocks__percent-green"
              : "WatchListStocks__percent-red"
          }`}
        >
          {stockInfo?.todays_change_percent.toFixed(2) > 0 && "+"}
          {stockInfo?.todays_change_percent.toFixed(2)}%
        </span>
      </span>
    </div>
  );
}

export default StocksOwnedItem;
