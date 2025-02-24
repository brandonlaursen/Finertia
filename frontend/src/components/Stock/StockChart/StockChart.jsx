import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({ stock, selectedTimeFrame }) {
  
  const {
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  } = stock;

  // const [currentPoint, setCurrentPoint] = useState(null);

  const [options] = useState({
    chart: {
      type: "line",
      height: 350,

      // events: {
      //   mouseMove: function (event, chartContext, opts) {
      //     console.log(currentPoint);

      //     setCurrentPoint({
      //       value: chartContext.w.config.series[0].data[opts.dataPointIndex].y,
      //     });
      //   },
      //   mouseLeave: function () {
      //     setCurrentPoint(null);
      //   },
      // },
      zoom: {
        enabled: false,
      },
      tickAmount: 10,
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
        formatter: (timestamp) => convertToEst(timestamp, selectedTimeFrame),
      },
      y: {
        formatter: function (value) {
          return `$` + value.toFixed(2);
        },
      },
      marker: {
        show: false,
      },
    },
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    let aggregates;

    if (selectedTimeFrame === "1D") {
      aggregates = oneDayAggregates;
    }
    if (selectedTimeFrame === "1W") {
      aggregates = oneWeekAggregates;
    }
    if (selectedTimeFrame === "1M") {
      aggregates = oneMonthAggregates;
    }
    if (selectedTimeFrame === "3M") {
      aggregates = threeMonthsAggregates;
    }
    if (selectedTimeFrame === "1Y") {
      aggregates = oneYearAggregates;
    }
    if (selectedTimeFrame === "5Y") {
      aggregates = fiveYearsAggregates;
    }

    if (aggregates) {
      setData(aggregates);
    }
  }, [
    selectedTimeFrame,
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
    options,
  ]);

  const series = [
    {
      name: "Price",
      data,
    },
  ];

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

export default StockChart;
