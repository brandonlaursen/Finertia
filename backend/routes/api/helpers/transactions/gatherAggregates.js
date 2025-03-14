function gatherAggregates(userHistoricalData) {
  function aggregatePoints(points, bucketDurationMs) {
    const buckets = {};
    points.forEach((point) => {
      const bucketKey =
        Math.floor(point.x / bucketDurationMs) * bucketDurationMs;
      if (!buckets[bucketKey] || point.x > buckets[bucketKey].x) {
        buckets[bucketKey] = { ...point, x: bucketKey };
      }
    });
    return Object.values(buckets).sort((a, b) => a.x - b.x);
  }

  const oneDayMs = 24 * 60 * 60 * 1000;
  const oneHourMs = 60 * 60 * 1000;
  const fiveMinMs = 5 * 60 * 1000;
  const now = Date.now();

  if (!Array.isArray(userHistoricalData) || userHistoricalData.length === 0) {
    console.warn("No historical data provided.");
    return {
      oneDayAggregates: [],
      oneWeekAggregates: [],
      oneMonthAggregates: [],
      threeMonthsAggregates: [],
      oneYearAggregates: [],
      fiveYearsAggregates: [],
    };
  }

  const mostRecentPoint = userHistoricalData.reduce((latest, current) =>
    current.x > latest.x ? current : latest
  );

  const firstTransaction = userHistoricalData[0];
  const firstTimestamp = firstTransaction.x;

  function getAggregates(timeframeMs, bucketSize) {
    let timeframeData = userHistoricalData.filter(
      (point) => point.x >= now - timeframeMs
    );

    const zeroBalancePoint = {
      x: firstTimestamp - bucketSize,
      y: 0,
    };

    timeframeData.unshift(zeroBalancePoint);

    if (!timeframeData.some((p) => p.x === mostRecentPoint.x)) {
      timeframeData.push(mostRecentPoint);
    }

    return aggregatePoints(timeframeData, bucketSize);
  }

  return {
    oneDayAggregates: getAggregates(oneDayMs, fiveMinMs),
    oneWeekAggregates: getAggregates(7 * oneDayMs, oneHourMs),
    oneMonthAggregates: getAggregates(30 * oneDayMs, oneHourMs),
    threeMonthsAggregates: getAggregates(90 * oneDayMs, oneDayMs),
    oneYearAggregates: getAggregates(365 * oneDayMs, oneDayMs),
    fiveYearsAggregates: getAggregates(5 * 365 * oneDayMs, oneDayMs),
  };
}

module.exports = gatherAggregates;
