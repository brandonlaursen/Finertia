

function roundTimestampToInterval(timestamp, intervalMinutes) {
  const date = new Date(timestamp);
  const remainder = date.getMinutes() % intervalMinutes;
  date.setMinutes(
    remainder >= intervalMinutes / 2
      ? date.getMinutes() + (intervalMinutes - remainder)
      : date.getMinutes() - remainder,
    0,
    0
  );
  return date.getTime();
}


module.exports = roundTimestampToInterval;
