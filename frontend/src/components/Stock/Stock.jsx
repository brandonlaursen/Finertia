import "./Stock.css";
function Stock() {
  return (
    <div className="stock-container">
      <div className="stock-left">
        <h1>Stock</h1>
        <span>Stock Price</span>
        <span>Stock Price Change: Today</span>
        <span>Stock Price Change: Overnight</span>
        <div>
          Stock Chart
        </div>
      </div>
      <div className="stock-right">right</div>
    </div>
  );
}

export default Stock;
