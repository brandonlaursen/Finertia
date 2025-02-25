import "./HomePageChart.css";

import { useState, useEffect } from "react";

import ReactApexChart from "react-apexcharts";

function HomePageChart({ stockSummary, selectedTimeFrame }) {
  const { fiveMinAggregates, oneHourUserAggregates, oneDayAggregates } =
    stockSummary;

  const [data, setData] = useState(fiveMinAggregates);

  const relevantValues = data
    .filter((point) => point.y > 0)
    .map((point) => point.y);
  const minValue = Math.min(...relevantValues);
  const maxValue = Math.max(...relevantValues);

  const range = maxValue - minValue;

  const padding = Math.max(range * 0.2, 0.5);
  const dynamicMin = minValue - padding;
  const dynamicMax = maxValue + padding;
  const middleValue = (dynamicMin + dynamicMax) / 2;

  const [options] = useState({
    // hides the grid
    grid: {
      show: false,
    },

    // color of chart line
    colors: ["#00E396"],

    // type of line stroke
    stroke: {
      width: 3,
      curve: "straight",
    },

    // controls the line gradient
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

    // size of circle marker
    markers: {
      size: 0,
    },

    // controls the chart
    chart: {
      type: "line",
      height: 350,
      zoom: {
        enabled: false,
      },
      // background: "black",

      // moves chart up,down,left, right
      offsetX: 0,
      offsetY: 0,

      // removes x-axis y-axis labels
      // sparkline: {
      //   enabled: true
      // },

      // controls tool bar options
      toolbar: {
        show: false,
        tools: {
          // download: true,
          // selection: true,
          // zoom: true,
          // zoomin: true,
          // zoomout: true,
          // pan: true,
          // reset: true,
        },
      },
    },

    // controls bottom labels
    xaxis: {
      // title: {
      //   // text: "Time",
      // },
      type: "datetime",

      // Formats the lables on x-axis
      labels: {
        show: false, // hides the labels
        format: "MMM dd ", // e.g., "Feb 24"
        style: {
          fontSize: "12px",
          color: "#333",
        },
      },

      axisTicks: {
        show: false,
        color: "#e0e0e0",
      },
      // tickAmount: 4,
      // tickPlacement: "on",

      axisBorder: {
        show: false,
        color: "#e0e0e0",
      },

      // controls the tool tip pop up for the x axis
      tooltip: {
        enabled: false,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        formatter: function (val) {
          // Format the x-axis value as desired.
          // For instance, just show the date:
          return new Date(val).toLocaleDateString("en-US", {
            timeZone: "America/New_York",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          });
        },
      },

      // controls the vertical line when hovering a point
      crosshairs: {
        show: true,

        stroke: {
          color: "#b6b6b6",
          width: 1,
          dashArray: 0,
        },
      },

      // datetimeDiscrete: true,
    },

    yaxis: {
      title: {
        // text: "Price"
      },
      min: dynamicMin, // Set a minimum value to zoom into a specific range
      max: dynamicMax,

      // datetimeDiscrete: true,
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      // logarithmic: true

      tooltip: {
        enabled: false,
        // formatter: (value) => `$${value.toFixed(2)}`
      },
    },

    annotations: {
      yaxis: [
        {
          y: middleValue,
          borderColor: "grey",
          borderWidth: 1,
          fillColor: "#blue",

          strokeDashArray: "1, 15",
        },
      ],
    },

    tooltip: {
          x: {
            formatter: function (val) {
              // Format the x-axis value as desired.
              // For instance, just show the date:
              return new Date(val).toLocaleDateString("en-US", {
                timeZone: "America/New_York",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
              });
            },
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

  // console.log(data);

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
      name: "",
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

// const [options] = useState({
//   chart: {
//     type: "line",
//     height: 350,
//     zoom: {
//       enabled: false,
//     },

//   },

//   xaxis: {
//     type: "datetime",
//     datetimeDiscrete: true,
//     labels: { show: false },
//     tickAmount: "dataPoints",
//     axisBorder: { show: false },
//     // axisTicks: { show: false },
//     crosshairs: {
//       show: true,
//       position: "back",
//       stroke: {
//         color: "#b6b6b6",
//         width: 1,
//         dashArray: 0,
//       },
//     },
//     // tooltip: {
//     //   enabled: false,
//     // },

//   },
//   yaxis: {
//     datetimeDiscrete: true,
//     labels: { show: false },
//     axisBorder: { show: false },
//     axisTicks: { show: false },

//   },

//   colors: ["#00E396"],
//   stroke: {
//     width: 3,
//     curve: "straight",
//   },
//   // markers: {
//   //   size: 0,
//   // },
//   grid: {
//     show: false,
//   },
//   tooltip: {
//     x: {
//       formatter: (timestamp) => convertToEst(timestamp),
//     },
//     y: {
//       formatter: function (value) {
//         return `$` + value.toFixed(2);
//       },
//     },
//     marker: {
//       show: false,
//     },
//   },
// });
