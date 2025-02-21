import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "./StockChart.css";

function StockChart({ stock, selectedTimeFrame }) {
  const {
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthAggregates,
    oneYearAggregates,
    fiveYearAggregates,
  } = stock;

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
        formatter: (timestamp) => convertToEst(timestamp, selectedTimeFrame),
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
      aggregates = threeMonthAggregates;
    }
    if (selectedTimeFrame === "1Y") {
      aggregates = oneYearAggregates;
    }
    if (selectedTimeFrame === "5Y") {
      aggregates = fiveYearAggregates;
    }

    if (aggregates) {
      const graphData = aggregates.map((aggregate) => ({
        x: aggregate.t,
        y: aggregate.c,
      }));

      setData(graphData);
    }
  }, [
    selectedTimeFrame,
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthAggregates,
    oneYearAggregates,
    fiveYearAggregates,
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
