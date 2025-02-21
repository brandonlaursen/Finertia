import "./StockInfo.css";
function StockInfo({ stock }) {
  const {
    description,
    totalEmployees,
    address,
    industry,
    marketCap,
    high,
    low,
    open,
    volume,
  } = stock;
  
  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  return (
    <div className="StockPage__info-container">
      <span className="aboutTitle">About</span>
      <span className="companyDescription">{description}</span>
      <span className="showMoreLink">Show More</span>

      <div className="company-info-container">
        <div className="company-info-item">
          <span className="info-label">CEO</span>
          <span className="info-value">-</span>
        </div>
        <div className="company-info-item">
          <span className="info-label">Employees</span>
          <span className="info-value">{formatNumber(totalEmployees)}</span>
        </div>
        <div className="company-info-item">
          <span className="info-label">Headquarters</span>
          <span className="info-value"> {address},</span>
        </div>
        <div className="company-info-item">
          <span className="info-label">Industry</span>
          <span className="info-value"> {industry}</span>
        </div>
      </div>

      <span className="key-statistics">Key statistics</span>
      <div className="statistics-container">
        <div className="statistics-column">
          <div>
            <span>Market cap</span>
            <span> {marketCap === 0 ? "-" : formatNumber(marketCap)}</span>
          </div>
          <div>
            <span>High today</span>
            <span>${high}</span>
          </div>
          <div>
            <span>52 Week high</span>
            <span>-</span>
          </div>
        </div>

        <div className="statistics-column">
          <div>
            <span>Price-Earnings ratio</span>
            <span>-</span>
          </div>
          <div>
            <span>Low today</span>
            <span>${low}</span>
          </div>
          <div>
            <span>52 Week low</span>
            <span>-</span>
          </div>
        </div>

        <div className="statistics-column">
          <div>
            <span>Dividend yield</span>
            <span>-</span>
          </div>
          <div>
            <span>Open price</span>
            <span>${open}</span>
          </div>
        </div>

        <div className="statistics-column">
          <div>
            <span>Average volume</span>
            <span>-</span>
          </div>
          <div>
            <span>Volume</span>
            <span> {formatNumber(volume)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockInfo;
