import "./SelectTimeFrame.css";

function SelectTimeFrame({ selectedTimeFrame, setSelectedTimeFrame }) {

  return (
    <div className="SelectTimeFrame">
      {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((timeFrame) => (
        <span
          key={timeFrame}
          onClick={() => setSelectedTimeFrame(timeFrame)}
          className={selectedTimeFrame === timeFrame && "SelectTimeFrame--selected"}
        >
          {timeFrame}
        </span>
      ))}
    </div>
  );
}

export default SelectTimeFrame;
