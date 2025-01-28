import "./Stock.css";
import { useState } from "react";

function Stock() {
  const [selected, setSelected] = useState("1D");

  const handleClick = (value) => {
    setSelected(value);
  };

  return (
    <div className="stock-container">

      {/* Left side */}
      <div className="stock-left">


        <span className="stock-name">Snap</span>
        <span className="stock-price">$10.90</span>
        <span className="price-change-today">
          <span className="price-change">+$0.05</span>
          <span className="price-change">(+0.51%)</span>
          <span>Today</span>
        </span>


        <span className="price-change-overnight">24 Hour Market</span>
        <div className="stock-chart"></div>
        <div className="time-frame-container">
          {["1D", "1W", "1M", "3M", "YTD", "5Y", "MAX"].map((timeFrame) => (
            <span
              key={timeFrame}
              onClick={() => handleClick(timeFrame)}
              className={selected === timeFrame ? "selected" : ""}
            >
              {timeFrame}
            </span>
          ))}
        </div>

        {/* Stock Info */}
        <div className="stock-info-container">

          <span className="aboutTitle">About</span>
          <span className="companyDescription">
            Snap, Inc. operates as a technology company, which engages in the
            provision of a visual messaging application that was created to help
            people communicate through short videos and images. The company was
            founded by Frank Reginald Brown IV, Evan Thomas Spiegel, and Robert
            C
          </span>
          <span className="showMoreLink">Show More</span>

          {/* Company Info */}
          <div className="company-info-container">
            <div className="company-info-item">
              <span className="info-label">CEO</span>
              <span className="info-value">Evan Thomas Spiegel</span>
            </div>
            <div className="company-info-item">
              <span className="info-label">Employees</span>
              <span className="info-value">5,289</span>
            </div>
            <div className="company-info-item">
              <span className="info-label">Headquarters</span>
              <span className="info-value">Santa Monica, California</span>
            </div>
            <div className="company-info-item">
              <span className="info-label">Founded</span>
              <span className="info-value">2010</span>
            </div>
          </div>

          {/* Company statistics */}
          <span className="key-statistics">Key statistics</span>
          <div className="statistics-container">
            <div className="statistics-column">
              <div>
                <span>Market cap</span>
                <span>18.19B</span>
              </div>
              <div>
                <span>High today</span>
                <span>—</span>
              </div>
              <div>
                <span>52 Week high</span>
                <span>$17.50</span>
              </div>
            </div>

            <div className="statistics-column">
              <div>
                <span>Price-Earnings ratio</span>
                <span>-18.71</span>
              </div>
              <div>
                <span>Low today</span>
                <span>—</span>
              </div>
              <div>
                <span>52 Week low</span>
                <span>$8.29</span>
              </div>
            </div>

            <div className="statistics-column">
              <div>
                <span>Dividend yield</span>
                <span>—</span>
              </div>
              <div>
                <span>Open price</span>
                <span>$10.59</span>
              </div>
              <div>
                <span>Volume</span>
                <span>23.58M</span>
              </div>
            </div>

            <div className="statistics-column">
              <div>
                <span>Average volume</span>
                <span>30.13M</span>
              </div>
              <div>
                <span>Volume</span>
                <span>23.58M</span>
              </div>
            </div>
          </div>
        </div>
        <span className="news-title">News</span>

        {/* Company news */}
        <div className="news-container">


            <div className="news-text">
              <span className="news-header">
                <span>Sherwood News</span>
                <span>Jan 23</span>
              </span>
              <span className="news-main-text">
                Byte Dance Board Member: TikTok looking for alternatives to sale
              </span>
              <span className="news-sub-text">
                Byte Dance Board Member: TikTok looking for alternatives to sale
              </span>
            </div>
            <div className="news-image">
              <img src="https://tse1.mm.bing.net/th?id=OIP.2p8hNdgF1MQeiDaT9ivDFAHaHa&pid=Api&P=0&h=220" alt="news image" />
            </div>
            
        </div>



      </div>

      {/* Right Side */}
      <div className="stock-right">right</div>
    </div>
  );
}

export default Stock;
