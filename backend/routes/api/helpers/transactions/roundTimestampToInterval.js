function roundTimestampToInterval(timestamp, intervalMinutes) {

  const date = new Date(timestamp);
  const remainder = date.getUTCMinutes() % intervalMinutes;
  date.setUTCMinutes(
    remainder >= intervalMinutes / 2
      ? date.getUTCMinutes() + (intervalMinutes - remainder)
      : date.getUTCMinutes() - remainder,
    0, // reset seconds
    0  // reset milliseconds
  );
  return date.getTime();
}

module.exports = roundTimestampToInterval;
