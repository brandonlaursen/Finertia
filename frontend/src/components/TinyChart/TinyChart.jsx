import "./TinyChart.css";
import ReactApexChart from "react-apexcharts";

import { useState } from "react";

function TinyChart({ aggregates, todays_change_percent }) {
  const series = [
    {
      name: "Price",
      data: aggregates,
    },
  ];

  const [options] = useState({
    chart: {
      type: "line",
      height: 10,
      width: 40,
      zoom: {
        enabled: false,
      },
      sparkline: { enabled: true },
    },
    colors: [
      todays_change_percent < 0
        ? "var(--theme-secondary-color)"
        : "var(--theme-primary-color)",
    ],

    stroke: { width: 1, curve: "straight" },

    tooltip: {
      enabled: false,
    },
  });

  return (
    <section className="StockListItem__graph">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height={20}
        width={70}
      />
    </section>
  );
}

export default TinyChart;
