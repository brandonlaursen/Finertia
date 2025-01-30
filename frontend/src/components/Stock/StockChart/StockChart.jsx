import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({
  allTimeFramesData,
  selectedTimeFrame,
  hoveredValue,
  setHoveredValue,
}) {
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

  const options = {
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      events: {
        dataPointMouseEnter: (
          event,
          chartContext,
          { dataPointIndex, seriesIndex }
        ) => {
          if (
            chartContext &&
            chartContext.w &&
            chartContext.w.config.series[seriesIndex]
          ) {
            const hoveredData =
              chartContext.w.config.series[seriesIndex].data[dataPointIndex];
            setHoveredValue(hoveredData.y); // Update hovered value
          }
        },
        dataPointMouseLeave: () => {
          setHoveredValue(null); // Reset value when not hovering
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: { show: false },
      tickAmount: "dataPoints",
      categories: data.map((d) => d.x),
    },
    yaxis: {
      labels: { show: false },
    },
    colors: ["#00E396"],
    stroke: { width: 3, curve: "straight" },
    tooltip: { enabled: false },
  };

  useEffect(() => {
    function within1D(data) {
      const timeToday = convertTime(
        Math.floor(Date.now() / 1000),
        "1D",
        "EST",
        true
      );

      const date = timeToday.split(" ")[1];

      return data.filter((obj) => {
        const convertedTime = convertTime(obj.x, "1D", "EST", true);
        const currDate = convertedTime.split(" ")[1];
        if (currDate === date) return obj;
      });
    }

    function within1W(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);
      console.log("unixTimeToday:", unixTimeToday);

      const weekInUnix = 604800;
      const weekAway = unixTimeToday - weekInUnix;
      console.log("weekAway:", weekAway);

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

    function within1Y(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);

      const yearInUnix = 31536000; // 365 days in seconds
      const yearAway = unixTimeToday - yearInUnix;

      return data.filter((obj) => {
        console.log(obj.x);
        if (obj.x >= yearAway && obj.x <= unixTimeToday) return obj;
      });
    }

    function within3M(data) {
      const unixTimeToday = Math.floor(Date.now() / 1000);

      const threeMonthsInUnix = 7884000; // 3 months (30.5 days each) in seconds
      const threeMonthsAway = unixTimeToday - threeMonthsInUnix;

      return data.filter((obj) => {
        console.log(obj.x);
        if (obj.x >= threeMonthsAway && obj.x <= unixTimeToday) return obj;
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

  console.log(hoveredValue);
  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={options.chart.height}
      />
      <div className="hovered-value">
        Hovered Price:{" "}
        {hoveredValue !== null ? hoveredValue : "Hover over a point"}
      </div>
    </div>
  );
}

export default StockChart;
