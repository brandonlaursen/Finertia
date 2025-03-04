import "./TinyChart.css";
import ReactApexChart from "react-apexcharts";

import { useState } from "react";

function TinyChart({ o, h, c }) {
  const mediumValue = (o + h + c) / 3;

  const data = [
    { x: 1, y: o },
    { x: 2, y: h },
    { x: 3, y: c },
  ];

  const series = [
    {
      name: "Price",
      data,
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
    colors: [c < o ? "#FF4560" : "#00E396"],
    stroke: { width: 1, curve: "straight" },
    annotations: {
      yaxis: [
        {
          y: mediumValue,
          borderColor: "var(--border-color)",
          borderWidth: 1,
          strokeDashArray: "1, 15",
        },
      ],
    },
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
