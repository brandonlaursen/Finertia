function gatherAggregates(userHistoricalData) {
  // const test = userHistoricalData.slice(20);

  // Aggregation helper: rounds each point down to the bucket start and picks the latest point per bucket.
  function aggregatePoints(points, bucketDurationMs) {
    const buckets = {};
    points.forEach((point) => {
      // Round down the timestamp to the start of the bucket.
      const bucketKey =
        Math.floor(point.x / bucketDurationMs) * bucketDurationMs;
      // Keep the point with the latest timestamp and override x with the bucketKey.
      if (!buckets[bucketKey] || point.x > buckets[bucketKey].x) {
        buckets[bucketKey] = { ...point, x: bucketKey };
      }
    });
    return Object.values(buckets).sort((a, b) => a.x - b.x);
  }

  // Define basic time durations in milliseconds.
  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneHourMs = 60 * 60 * 1000;

  // Get the current time and today's midnight timestamp.
  const now = Date.now();
  const todayMidnightTimestamp = new Date().setHours(0, 0, 0, 0);

  // For each timeframe, first filter the points to include only data older than today (before midnight)
  // and within the desired timeframe.

  // One Day (last 24 hours) aggregated to 5-minute buckets:
  const oneDayData = userHistoricalData.filter(
    (point) => point.x >= now - oneDayMs && point.x <= now
  );

  const oneDayFiveMinAggregates = aggregatePoints(oneDayData, 5 * 60 * 1000);

  const mostRecentAggregate =
    oneDayFiveMinAggregates[oneDayFiveMinAggregates.length - 1];

  // One Week (last 7 days) aggregated to 1-hour buckets:
  const oneWeekMs = 7 * oneDayMs;
  const oneWeekData = userHistoricalData.filter(
    (point) => point.x >= now - oneWeekMs && point.x <= now
  );
  const oneWeekOneHourAggregates = aggregatePoints(oneWeekData, oneHourMs);

  // One Month (last 30 days) aggregated to 1-hour buckets:
  const oneMonthMs = 30 * oneDayMs;
  const oneMonthData = userHistoricalData.filter(
    (point) => point.x >= now - oneMonthMs && point.x <= now
  );
  const oneMonthOneHourAggregates = aggregatePoints(oneMonthData, oneHourMs);

  // Three Months (last 90 days) aggregated to 1-day buckets:
  const threeMonthMs = 90 * oneDayMs;
  const threeMonthData = userHistoricalData.filter(
    (point) => point.x >= now - threeMonthMs && point.x <= now
  );
  const threeMonthOneDayAggregates = [
    ...aggregatePoints(threeMonthData, oneDayMs),
    mostRecentAggregate,
  ];


  // One Year (last 365 days) aggregated to 1-day buckets:
  const oneYearMs = 365 * oneDayMs;
  const oneYearData = userHistoricalData.filter(
    (point) => point.x >= now - oneYearMs && point.x < todayMidnightTimestamp
  );
  const oneYearOneDayAggregates = [
    ...aggregatePoints(oneYearData, oneDayMs),
    mostRecentAggregate,
  ];

  // Five Years (last 5 years) aggregated to 1-day buckets:
  const fiveYearMs = 5 * oneYearMs;
  const fiveYearData = userHistoricalData.filter(
    (point) => point.x >= now - fiveYearMs && point.x < todayMidnightTimestamp
  );
  const fiveYearOneDayAggregates = [
    ...aggregatePoints(fiveYearData, oneDayMs),
    mostRecentAggregate,
  ];



  return {
    oneDayFiveMinAggregates,
    oneWeekOneHourAggregates,
    oneMonthOneHourAggregates,
    threeMonthOneDayAggregates,
    oneYearOneDayAggregates,
    fiveYearOneDayAggregates,
  };
}

module.exports = gatherAggregates;
