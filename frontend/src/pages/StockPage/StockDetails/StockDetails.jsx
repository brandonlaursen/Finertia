import "./StockDetails.css";
import { useState } from "react";

function StockDetails({ stock }) {
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

  const [showMoreStockDetails, setShowMoreStockDetails] = useState(false);

  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  return (
    <div className="StockDetails">
      <section className="StockDetails__about">
        <h1 className="StockDetails__header">About</h1>
        <p
          className="StockDetails__about"
          style={{
            maxHeight: showMoreStockDetails ? "280px" : "42px",
          }}
        >
          {description}
        </p>
        <button
          className="StockDetails__show-more-button"
          onClick={() => setShowMoreStockDetails(!showMoreStockDetails)}
        >
          {showMoreStockDetails ? "Show Less" : "Show More"}
        </button>
      </section>

      <section className="StockDetails__section">
        <div>
          <span>CEO</span>
          <span>-</span>
        </div>
        <div>
          <span>Employees</span>
          <span>{formatNumber(totalEmployees)}</span>
        </div>
        <div>
          <span>Headquarters</span>
          <span>{address}</span>
        </div>
        <div>
          <span>Industry</span>
          <span>{industry}</span>
        </div>
      </section>

      <header className="StockDetails__header">Key statistics</header>
      <section className="StockDetails__section">
        <div>
          <span>Market cap</span>
          <span> {marketCap === 0 ? "-" : formatNumber(marketCap)}</span>
        </div>
        <div>
          <span>Price-Earnings ratio</span>
          <span>-</span>
        </div>
        <div>
          <span>Dividend yield</span>
          <span>-</span>
        </div>
        <div>
          <span>Average volume</span>
          <span>-</span>
        </div>
        <div>
          <span>High today</span>
          <span>${high}</span>
        </div>
        <div>
          <span>Low today</span>
          <span>${low}</span>
        </div>
        <div>
          <span>Open price</span>
          <span>${open}</span>
        </div>
        <div>
          <span>Volume</span>
          <span> {formatNumber(volume)}</span>
        </div>
        <div>
          <span>52 Week high</span>
          <span>-</span>
        </div>
        <div>
          <span>52 Week low</span>
          <span>-</span>
        </div>
      </section>
    </div>
  );
}

export default StockDetails;
