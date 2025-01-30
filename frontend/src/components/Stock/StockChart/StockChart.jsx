import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({ allTimeFramesData, selectedTimeFrame }) {
  console.log("allTimeFramesData:", allTimeFramesData);
  const [data, setData] = useState([]);
  console.log("data:", data);

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
      curve: "monotoneCubic",
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

  useEffect(() => {
    function within1D(data) {
      const timeToday = convertTime(
        Math.floor(Date.now() / 1000),
        "1D",
        "EST",
        true
      );

      const targetMonth = timeToday.split(" ")[0];
      const targetDay = timeToday.split(" ")[1];
      const targetDate = targetMonth + targetDay;

      return data.filter((obj) => {
        const convertedTime = convertTime(obj.x, "1D", "EST", true);
        const currentMonth = convertedTime.split(" ")[0];
        const currentDay = convertedTime.split(" ")[1];
        const currentDate = currentMonth + currentDay;
        if (currentDate === targetDate) return obj;
      });
    }

    function within1W(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);
      const weekInUnix = 604800;
      const weekAway = unixTimeToday - weekInUnix;

      return data.filter((obj) => {
        console.log(obj.x);
        if (obj.x >= weekAway && obj.x <= unixTimeToday) return obj;
      });
    }

    function within1M(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);
      console.log("unixTimeToday:", unixTimeToday);

      const monthInUnix = 2592000; // 30 days in seconds
      const monthAway = unixTimeToday - monthInUnix;
      console.log("monthAway:", monthAway);

      return data.filter((obj) => {
        console.log(obj.x);
        if (obj.x >= monthAway && obj.x <= unixTimeToday) return obj;
      });
    }

    function within3M(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);

      const threeMonthsInUnix = 7884000; // 3 months (30.5 days each) in seconds
      const threeMonthsAway = unixTimeToday - threeMonthsInUnix;

      return data.filter((obj) => {
        if (obj.x >= threeMonthsAway && obj.x <= unixTimeToday) return obj;
      });
    }

    function within1Y(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);

      const yearInUnix = 31536000; // 365 days in seconds
      const yearAway = unixTimeToday - yearInUnix;

      return data.filter((obj) => {
        if (obj.x >= yearAway && obj.x <= unixTimeToday) return obj;
      });
    }

    if (selectedTimeFrame === "1D") {
      setData(within1D(allTimeFramesData));
    }

    if (selectedTimeFrame === "1W") {
      setData(within1W(allTimeFramesData));
    }

    if (selectedTimeFrame === "1M") {
      setData(within1M(allTimeFramesData));
    }

    if (selectedTimeFrame === "3M") {
      setData(within3M(allTimeFramesData));
    }
    if (selectedTimeFrame === "1Y") {
      setData(within1Y(allTimeFramesData));
    }
  }, [selectedTimeFrame, allTimeFramesData]);

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
