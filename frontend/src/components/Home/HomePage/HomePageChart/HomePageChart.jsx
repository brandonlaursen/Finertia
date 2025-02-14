import "./HomePageChart.css";


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockTransactions } from "../../../../../store/transactions";

import ReactApexChart from "react-apexcharts";

function HomePageChart() {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.transactions.stockTransactions
  );

  const sortedTransactions = transactions.sort((a, b) => {
    const dateA = a.transactionDate ? new Date(a.transactionDate) : new Date(0);
    const dateB = b.transactionDate ? new Date(b.transactionDate) : new Date(0);

    return dateB - dateA;
  });




  console.log("sortedTransactions:", sortedTransactions);

  const [data, ] = useState([]);

  const [options] = useState({
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
      tickAmount: 10,
      plotOptions: {
        line: {
          isSlopeChart: false,
          colors: {
            threshold: "239",
            colorAboveThreshold: "#00E396",
            colorBelowThreshold: "FF4560",
          },
        },
      },
    },
    xaxis: {
      type: "datetime",
      datetimeDiscrete: true,
      labels: { show: false },
      tickAmount: "dataPoints",
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        position: "back",
        stroke: {
          color: "#b6b6b6",
          width: 1,
          dashArray: 0,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      datetimeDiscrete: true,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    colors: ["#00E396"],
    stroke: {
      width: 3,
      curve: "straight",
    },
    markers: {
      size: 0,
    },
    grid: {
      show: false,
    },
    tooltip: {
      x: {
        formatter: (timestamp) => convertToEst(timestamp),
      },
      marker: {
        show: false,
      },
    },
  });

  const series = [
    {
      name: "Price",
      data,
    },
  ];

  useEffect(() => {
    dispatch(fetchStockTransactions());
  }, [dispatch]);

  function convertToEst(timestamp) {
    const date = new Date(timestamp);

    const options1 = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZone: "America/New_York",
    };

    const dateTimeFormat = new Intl.DateTimeFormat("en-US", options1);

    return dateTimeFormat.format(date);
  }

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={options.chart.height}
      />
    </div>
  );
}

export default HomePageChart;
