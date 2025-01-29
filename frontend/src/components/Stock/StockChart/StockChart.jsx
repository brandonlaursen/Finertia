import { useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({ stockCandles }) {
  console.log("stockCandles:", stockCandles);
  // const stockData2 = {
  //   c: [217.68, 221.03, 219.89],
  //   t: [1569297600, 1569384000, 1569470400], // Unix timestamps in SECONDS (UTC)
  // };

  const stockData = {
    c: stockCandles.c,
    t: stockCandles.t,
  };

  // Convert timestamps to UTC milliseconds
  const data = stockData.t.map((timestamp, i) => ({
    x: timestamp * 1000, // Convert to milliseconds
    y: stockData.c[i],
  }));

  const series = [
    {
      name: "Price",
      data,
    },
  ];

  const formatTime = (timestamp, convertToEST = false) => {
    const date = new Date(timestamp);

    if (convertToEST) {
      date.setUTCHours(date.getUTCHours()); // Convert to EST (UTC-5)
    }

    return date.toLocaleTimeString("en-US", {
      month: "short", // Short month name (e.g., Jan, Feb)
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      // timeZone: "UTC", // Keep as UTC (remove this line if converting manually)
    });
  };

  const [options, setOptions] = useState({
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
      tickAmount: 10,
    },
    xaxis: {
      type: "datetime",
      labels: { show: false }, // Hide x-axis labels
      axisBorder: { show: false }, // Hide x-axis border
      axisTicks: { show: false }, // Hide x-axis ticks
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
      labels: { show: false }, // Hide x-axis labels
      axisBorder: { show: false }, // Hide x-axis border
      axisTicks: { show: false }, // Hide x-axis ticks
    },
    colors: ["#00E396"],
    stroke: {
      width: 3,
      curve: "monotoneCubic",
    },
    markers: {
      size: 0, // Remove dots
    },
    grid: {
      show: false, // Remove grid lines
    },
    tooltip: {
      x: {
        formatter: (timestamp) => formatTime(timestamp, true), // Convert tooltip to EST
      },
      marker: {
        show: false,
      },
    },
  });

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

export default StockChart;
