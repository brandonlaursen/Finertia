import "./TimeFrameSelector.css";

function TimeFrameSelector({ selectedTimeFrame, setSelectedTimeFrame }) {

  return (
    <div className="TimeFrameSelector">
      {["1D", "1W", "1M", "3M", "1Y", "All"].map((timeFrame) => (
        <span
          key={timeFrame}
          onClick={() => setSelectedTimeFrame(timeFrame)}
          className={selectedTimeFrame === timeFrame && "TimeFrameSelector--selected"}
        >
          {timeFrame}
        </span>
      ))}
    </div>
  );
}

export default TimeFrameSelector;
