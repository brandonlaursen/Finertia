import { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import "./HomePageChart.css";

function HomePageChart({ stockSummary, selectedTimeFrame }) {
  const { fiveMinAggregates, oneHourUserAggregates, oneDayAggregates } = stockSummary;
  const [data, setData] = useState(fiveMinAggregates);

  useEffect(() => {
    let aggregates;
    if (selectedTimeFrame === "1D") aggregates = fiveMinAggregates;
    if (selectedTimeFrame === "1W") aggregates = oneHourUserAggregates;
    if (selectedTimeFrame === "1M") aggregates = oneHourUserAggregates;
    if (selectedTimeFrame === "3M") aggregates = oneDayAggregates;
    if (selectedTimeFrame === "1Y") aggregates = oneDayAggregates;
    if (selectedTimeFrame === "5Y") aggregates = oneDayAggregates;
    if (aggregates) {
      setData(aggregates);
    }
  }, [fiveMinAggregates, oneHourUserAggregates, oneDayAggregates, selectedTimeFrame]);

  // Compute dynamic values
  const { dynamicMin, dynamicMax, middleValue } = useMemo(() => {
    const relevantValues = data
      .filter((point) => point.y > 0)
      .map((point) => point.y);
    const minValue = Math.min(...relevantValues);
    const maxValue = Math.max(...relevantValues);
    const range = maxValue - minValue;
    const padding = Math.max(range * 0.1, 0.5);
    const dynamicMin = minValue - padding;
    const dynamicMax = maxValue + padding;

    // Average as middle
    const avgValue =
      relevantValues.reduce((sum, val) => sum + val, 0) / relevantValues.length;
    const middleValue = avgValue;

    return { dynamicMin, dynamicMax, middleValue };
  }, [data]);

  // Memoize chart options so they update only when dynamic values or selectedTimeFrame change
  const options = useMemo(() => ({
    grid: { show: false },
    colors: ["#00E396"],
    stroke: { width: 3, curve: "straight" },
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
    chart: {
      type: "line",
      height: 350,
      zoom: { enabled: false },
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    xaxis: {
      type: "datetime",
      labels: { show: false },
      axisTicks: { show: false, color: "#e0e0e0" },
      axisBorder: { show: false, color: "#e0e0e0" },
      crosshairs: {
        show: true,
        stroke: { color: "#b6b6b6", width: 1, dashArray: 0 },
      },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: dynamicMin,
      max: dynamicMax,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    annotations: {
      yaxis: [{
        y: middleValue,
        borderColor: "grey",
        borderWidth: 1,
        strokeDashArray: "1, 15",
      }],
    },
    tooltip: {
      x: {
        formatter: (val) =>
          new Date(val).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          }),
      },
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
      marker: { show: false },
    },
  }), [dynamicMin, dynamicMax, middleValue]);

  const series = [
    {
      name: "Price",
      data,
    },
  ];

  return (
    <div className="chart-container">
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
