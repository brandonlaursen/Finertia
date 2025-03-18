

// * Format user/stocks historical data
// * return aggregates
function formatMergedTransactions(mergedTransactionData) {
  const mergedTransactionDataArray = Object.values(mergedTransactionData);
  console.log(" mergedTransactionDataArray:", mergedTransactionDataArray);
  const lastTransaction =
    mergedTransactionDataArray[mergedTransactionDataArray.length - 1];

  const userHistoricalData = Object.values(mergedTransactionData).map(
    (data) => ({
      x: data.timestamp,
      y: data.totalInvestments,
    })
  );

  return { lastTransaction, userHistoricalData };
}

module.exports = formatMergedTransactions;
