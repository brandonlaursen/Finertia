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
        <header className="StockDetails__about-header">About</header>
        <p
          className="StockDetails__about-description"
          style={{
            maxHeight: showMoreStockDetails ? "200px" : "42px",
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


      <section className="company-info-container">
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
      </section>

      <header className="StockDetails__header">Key statistics</header>

      <div className="statistics-container">
        <section className="statistics-column">
          <div>
            <span>Market cap</span>
            <span> {marketCap === 0 ? "-" : formatNumber(marketCap)}</span>
          </div>
          <div>
            <span>High today</span>
            <span>${high}</span>
          </div>
          section
          <div>
            <span>52 Week high</span>
            <span>-</span>
          </div>
        </section>

        <section className="statistics-column">
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
        </section>

        <section className="statistics-column">
          <div>
            <span>Dividend yield</span>
            <span>-</span>
          </div>
          <div>
            <span>Open price</span>
            <span>${open}</span>
          </div>
        </section>

        <section className="statistics-column">
          <div>
            <span>Average volume</span>
            <span>-</span>
          </div>
          <div>
            <span>Volume</span>
            <span> {formatNumber(volume)}</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default StockDetails;
