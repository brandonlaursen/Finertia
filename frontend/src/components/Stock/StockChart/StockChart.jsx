import "./StockChart.css";

import { useMemo } from "react";

import ReactApexChart from "react-apexcharts";


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

function StockChart({ stock, selectedTimeFrame }) {
  const {
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  } = stock;

  const data = useMemo(() => {
    const aggregatesMap = {
      "1D": oneDayAggregates,
      "1W": oneWeekAggregates,
      "1M": oneMonthAggregates,
      "3M": threeMonthsAggregates,
      "1Y": oneYearAggregates,
      "5Y": fiveYearsAggregates,
    };

    return aggregatesMap[selectedTimeFrame] || [];
  }, [
    selectedTimeFrame,
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  ]);

  const { dynamicMin, dynamicMax, middleValue } = useMemo(() => {
    if (!data || data.length === 0) {
      return { dynamicMin: 0, dynamicMax: 0, middleValue: 0 };
    }

    const dataPoints = data
      .filter((point) => point.y > 0)
      .map((point) => point.y);

    if (dataPoints.length === 0) {
      return { dynamicMin: 0, dynamicMax: 0, middleValue: 0 };
    }

    const minValue = Math.min(...dataPoints);
    const maxValue = Math.max(...dataPoints);
    const range = maxValue - minValue;
    const padding = Math.max(range * 0.1, 0.5);

    const dynamicMin = minValue - padding;
    const dynamicMax = maxValue + padding;

    const avgValue =
      dataPoints.reduce((sum, val) => sum + val, 0) / dataPoints.length;

    return { dynamicMin, dynamicMax, middleValue: avgValue };
  }, [data]);

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

  const series = [
    {
      name: "Price",
      data,
    },
  ];



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
