function getDate(daysAgo = 0) {
  let date = new Date();
  date.setDate(date.getDate() - daysAgo);

  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/New_York",
  };

  const dateTimeFormat = new Intl.DateTimeFormat("en-GB", options);
  const [day, month, year] = dateTimeFormat.format(date).split("/");

  return `${year}-${month}-${day}`;
}

module.exports = { getDate };
