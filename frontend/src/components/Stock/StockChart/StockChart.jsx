import { useEffect, useState, useMemo } from "react";
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

  const [data, setData] = useState([]);

  const relevantValues = data
    .filter((point) => point.y > 0)
    .map((point) => point.y);
  const minValue = Math.min(...relevantValues);
  const maxValue = Math.max(...relevantValues);
  const range = maxValue - minValue;
  const padding = Math.max(range * 0.1, 0.5);
  const dynamicMin = minValue - padding;
  const dynamicMax = maxValue + padding;

  const avgValue =
    relevantValues.reduce((sum, val) => sum + val, 0) / relevantValues.length;

  // Use the average as your middle value
  const middleValue = avgValue;

  const series = [
    {
      name: "Price",
      data,
    },
  ];

  const options = useMemo(
    () => ({
      chart: {
        type: "line",
        height: 350,
        zoom: { enabled: false },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.6,
            opacityFrom: 1,
            opacityTo: 1,
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
          stroke: { color: "#b6b6b6", width: 1, dashArray: 0 },
        },
        tooltip: { enabled: false },
      },
      annotations: {
        yaxis: [
          {
            y: middleValue,
            borderColor: "grey",
            borderWidth: 1,
            strokeDashArray: "1, 15",
          },
        ],
      },
      yaxis: {
        min: dynamicMin,
        max: dynamicMax,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },

      colors: ["#00E396"],

      stroke: { width: 3, curve: "straight" },
      markers: { size: 0 },
      grid: { show: false },
      tooltip: {
        x: {
          formatter: (timestamp) => convertToEst(timestamp, selectedTimeFrame),
        },
        y: {
          formatter: (value) => `$${value.toFixed(2)}`,
        },
        marker: { show: false },
      },
    }),
    [dynamicMin, dynamicMax, middleValue, selectedTimeFrame]
  );

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

  function convertToEst(timestamp) {
    const date = new Date(timestamp);

    const options1 = {
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
