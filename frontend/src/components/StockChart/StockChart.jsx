import "./StockChart.css";

import { useMemo } from "react";

import ReactApexChart from "react-apexcharts";

import { convertTimestampToEST } from "./convertTimestampToEST";

function StockChart({ stockData, selectedTimeFrame }) {
  const {
    oneDayAggregates,
    oneWeekAggregates,
    oneMonthAggregates,
    threeMonthsAggregates,
    oneYearAggregates,
    fiveYearsAggregates,
  } = stockData;

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

    const dataPoints = data.map((point) => point.y);
    if (dataPoints.length === 0) {
      return { dynamicMin: 0, dynamicMax: 0, middleValue: 0 };
    }

    const minValue = Math.min(...dataPoints);
    const maxValue = Math.max(...dataPoints);
    const range = maxValue - minValue;

    const padding = range < 1 ? 0.5 : Math.max(range * 0.1, 0.5);

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
        zoom: {
          type: "x",
          enabled: true,
          autoScaleYaxis: true,
        },

        toolbar: {
          tools: {
            download: false,
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 1,
          opacityFrom: 1,
          opacityTo: 1,
          gradientToColors: [
            // "#FDD835",
            "var(--theme-primary-hover-light)",
          ],
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
          stroke: { color: "var(--border-color)", width: 1, dashArray: 0 },
        },
        tooltip: { enabled: false },
        plotOptions: {
          line: {
            colors: {
              threshold: 10,
              colorAboveThreshold: "#0088ee",
              colorBelowThreshold: "#ff0000",
            },
          },
        },
      },
      annotations: {
        yaxis: [
          {
            y: middleValue,
            borderColor: "var(--border-color)",
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

      colors: ["var( --theme-primary-color)"],

      stroke: { width: 3, curve: "straight" },
      markers: { size: 0 },
      grid: { show: false },
      tooltip: {
        x: {
          formatter: (timestamp) =>
            convertTimestampToEST(timestamp, selectedTimeFrame),
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
    <div className="StockChart">
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
