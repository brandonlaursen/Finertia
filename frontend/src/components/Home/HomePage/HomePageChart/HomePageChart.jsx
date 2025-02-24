import "./HomePageChart.css";

import { useState, useEffect } from "react";

import ReactApexChart from "react-apexcharts";

function HomePageChart({ stockSummary, selectedTimeFrame }) {

  const { fiveMinAggregates, oneHourUserAggregates, oneDayAggregates } =
    stockSummary;



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

  const [data, setData] = useState(fiveMinAggregates);


  useEffect(() => {
    let aggregates;

    if (selectedTimeFrame === "1D") {
      aggregates = fiveMinAggregates;
    }
    if (selectedTimeFrame === "1W") {

      aggregates = oneHourUserAggregates;
    }
    if (selectedTimeFrame === "1M") {
      aggregates = oneHourUserAggregates;
    }
    if (selectedTimeFrame === "3M") {
      aggregates = oneDayAggregates;
    }
    if (selectedTimeFrame === "1Y") {
      aggregates = oneDayAggregates;
    }
    if (selectedTimeFrame === "5Y") {
      aggregates = oneDayAggregates;
    }

    if (aggregates) {
      setData(aggregates);
    }
  }, [
    fiveMinAggregates,
    oneHourUserAggregates,
    oneDayAggregates,
    selectedTimeFrame,
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

export default HomePageChart;
