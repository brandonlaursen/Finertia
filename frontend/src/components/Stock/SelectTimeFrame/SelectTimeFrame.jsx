import "./SelectTimeFrame.css";

function SelectTimeFrame({ selectedTimeFrame, setSelectedTimeFrame }) {
  const handleClick = (value) => {
    setSelectedTimeFrame(value);
  };

  return (
    <div className="StockPage__main-time-frame-container">
      {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((timeFrame) => (
        <span
          key={timeFrame}
          onClick={() => handleClick(timeFrame)}
          className={selectedTimeFrame === timeFrame && "selected"}
        >
          {timeFrame}
        </span>
      ))}
    </div>
  );
}

export default SelectTimeFrame;
