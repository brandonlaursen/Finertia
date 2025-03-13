export function convertTimestampToEST(timestamp, selectedTimeFrame) {
  const date = new Date(timestamp);

  const formatOptions = {
    "1D": {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
    "1W": {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
    "1M": {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
    "3M": {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    "1Y": {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
    "5Y": {
      month: "short",
      day: "numeric",
      year: "numeric",
    },
  };

  const options = {
    ...formatOptions[selectedTimeFrame],
    timeZone: "America/New_York",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-US", options);
  return dateTimeFormat.format(date);
}
