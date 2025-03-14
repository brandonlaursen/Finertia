function verifyAggregateData(data) {
  if (!data || !Array.isArray(data)) {
    console.error("Invalid or missing aggregate data:", data);
    return false;
  }
  return true;
}

function formatOneDayAggregates(oneDayData) {
  if (!verifyAggregateData(oneDayData?.results)) return [];

  return oneDayData.results.map((aggregate) => ({
    x: aggregate.t,
    y: aggregate.c,
  }));
}

function formatOneWeekAggregates(oneWeekData) {
  if (!verifyAggregateData(oneWeekData?.results)) return [];

  return oneWeekData.results.map((aggregate) => ({
    x: aggregate.t,
    y: aggregate.c,
  }));
}

function formatOneMonthAggregates(oneMonthData) {
  if (!verifyAggregateData(oneMonthData)) return [];

  return oneMonthData.map((aggregate) => {
    const unixTimestamp = new Date(aggregate.timestamp).getTime();
    return {
      x: unixTimestamp,
      y: aggregate.price,
    };
  });
}

function formatThreeMonthsAggregates(fiveYearsData) {
  if (!verifyAggregateData(fiveYearsData)) return [];

  const currentTime = Date.now();
  return fiveYearsData
    .filter((aggregate) => {
      const unixTimestamp = new Date(aggregate.timestamp).getTime();
      return currentTime - unixTimestamp <= 3 * 30 * 24 * 60 * 60 * 1000; // 90 days in milliseconds
    })
    .map((aggregate) => {
      const unixTimestamp = new Date(aggregate.timestamp).getTime();
      return {
        x: unixTimestamp,
        y: aggregate.price,
      };
    });
}

function formatOneYearAggregates(fiveYearsData) {
  if (!verifyAggregateData(fiveYearsData)) return [];

  const currentTime = Date.now();

  return fiveYearsData
    .filter((aggregate) => {
      const unixTimestamp = new Date(aggregate.timestamp).getTime();
      return currentTime - unixTimestamp <= 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds
    })
    .map((aggregate) => {
      const unixTimestamp = new Date(aggregate.timestamp).getTime();
      return {
        x: unixTimestamp,
        y: aggregate.price,
      };
    });
}

function formatFiveYearsAggregates(fiveYearsData) {
  if (!verifyAggregateData(fiveYearsData)) return [];
  return fiveYearsData.map((aggregate) => {
    const unixTimestamp = new Date(aggregate.timestamp).getTime();
    return {
      x: unixTimestamp,
      y: aggregate.price,
    };
  });
}

module.exports = {
  formatOneDayAggregates,
  formatOneWeekAggregates,
  formatOneMonthAggregates,
  formatThreeMonthsAggregates,
  formatOneYearAggregates,
  formatFiveYearsAggregates,
};
