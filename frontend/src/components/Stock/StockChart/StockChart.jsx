import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({ allTimeFramesData, selectedTimeFrame }) {
  const [data, setData] = useState([]);

  const series = [
    {
      name: "Price",
      data,
    },
  ];

  function convertTime(
    unixTime,
    range = "1D",
    timezone = "EST",
    fullDate = false,
    weekDay = false
  ) {
    const date = new Date(unixTime * 1000);
    let options = {
      // timeZoneName: "short",
      hour: "numeric",
      minute: "numeric",
      timeZone: timezone,
      hour12: true,
    };

    if (
      range === "1W" ||
      range === "1M" ||
      range === "1Y" ||
      range === "3M" ||
      fullDate === true
    ) {
      options.month = "short";
      options.day = "numeric";
    }
    if (range === "1Y" || range === "3M") {
      options.year = "numeric";
      delete options.hour;
      delete options.minute;
    }
    if (fullDate === true) {
      options.year = "numeric";
    }
    if (weekDay === true) {
      options.weekday = "short";
    }

    const estDate = new Intl.DateTimeFormat("en-US", options).format(date);
    return estDate;
  }

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
      type: "datetime", // Set x-axis to handle datetime
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
        formatter: (timestamp) => convertTime(timestamp, "1D", "EST", true), // Format timestamp for tooltip
      },
      marker: {
        show: false,
      },
    },
  });

  // useEffect(() => {
  //   function within1D(data) {
  //     const timeToday = convertTime(
  //       Math.floor(Date.now() / 1000),
  //       "1D",
  //       "EST",
  //       true
  //     );

  //     const targetMonth = timeToday.split(" ")[0];
  //     const targetDay = timeToday.split(" ")[1];
  //     const targetDate = targetMonth + targetDay;

  //     return data.filter((obj) => {
  //       const convertedTime = convertTime(obj.x, "1D", "EST", true);
  //       const currentMonth = convertedTime.split(" ")[0];
  //       const currentDay = convertedTime.split(" ")[1];
  //       const currentDate = currentMonth + currentDay;
  //       if (currentDate === targetDate) return obj;
  //     });
  //   }

  //   function withinTimeFrame(data, range) {
  //     const unixTimeToday = Math.floor(Date.now() / 1000);
  //     let timeOffset = 0;

  //     if (range === "1D") timeOffset = 86400;
  //     if (range === "1W") timeOffset = 604800;
  //     if (range === "1M") timeOffset = 2592000;
  //     if (range === "3M") timeOffset = 7884000;
  //     if (range === "1Y") timeOffset = 31536000;

  //     return data.filter((obj) => obj.x >= unixTimeToday - timeOffset);
  //   }

  //   if (selectedTimeFrame === "1D") {
  //     setData(within1D(allTimeFramesData));
  //     return;
  //   }

  //   setData(withinTimeFrame(allTimeFramesData, selectedTimeFrame));
  // }, [selectedTimeFrame, allTimeFramesData]);

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
