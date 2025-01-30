import "./Stock.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStockData } from "../../../store/stocks";
import StockChart from "./StockChart/";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

function Stock() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const stock = useSelector((state) => state.stock.currentStock);

  const { stockProfile, stockTickers, historicalData, companyNews } = stock;

  useEffect(() => {
    dispatch(getStockData(stockSymbol));
  }, [dispatch, stockSymbol]);

  const handleClick = (value) => {
    console.log("value:", value);

    setSelectedTimeFrame(value);
  };

  function formatMarketCap(marketCap) {
    if (marketCap >= 1e6) {
      // If the value is 1 trillion or more, use "T"
      return (marketCap / 1e6).toFixed(2) + "T";
    } else if (marketCap >= 1e9) {
      // If the value is 1 billion or more, use "B"
      return (marketCap / 1e9).toFixed(2) + "B";
    } else if (marketCap >= 1e12) {
      // If the value is 1 million or more, use "M"
      return (marketCap / 1e12).toFixed(2) + "M";
    } else {
      // For smaller values, return the original number
      return marketCap.toString();
    }
  }

  function timeAgo(timestamp) {
    const now = Date.now() / 1000;
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(diff / 3600);
    const days = Math.floor(diff / (3600 * 24));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return `Just now`;
    }
  }

  if (!(stockProfile && stockTickers && historicalData && companyNews)) {
    return (
      <div className="loading-overlay">
        <LoadingSpinner />
      </div>
    );
  } else {
    const {
      longBusinessSummary,
      companyOfficers,
      fullTimeEmployees,
      city,
      state,
      industry,
    } = stockProfile.body;

    const {
      symbol,
      primaryData: { askPrice },
    } = stockTickers.body;

    const {
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      regularMarketDayHigh,
      regularMarketDayLow,
      regularMarketVolume,
    } = historicalData.meta;

    const allTimeFramesData = Object.entries(historicalData.body).map(
      ([timestamp, obj]) => ({
        x: Number(timestamp),
        y: obj.close,
      })
    );

    return (
      <div className="stock-container">
        {stockProfile && stockTickers && historicalData && (
          <div className="stock-left">
            <span className="stock-name">{symbol}</span>
            <span className="stock-price">{askPrice}</span>
            <span className="price-change-today">
              {/* <span
                className={`price-change ${
                  netChange < 0 ? "negative" : netChange > 0 ? "positive" : ""
                }`}
              >
                ${netChange}
              </span> */}
              <span className={`price-change`}>-</span>
              <span className="price-change">{"-"}</span>
              <span>Today</span>
            </span>

            <span className="price-change-overnight">24 Hour Market</span>
            <StockChart
              allTimeFramesData={allTimeFramesData}
              selectedTimeFrame={selectedTimeFrame}
            />
            <div className="time-frame-container">
              {["1D", "1W", "1M", "3M"].map((timeFrame) => (
                <span
                  key={timeFrame}
                  onClick={() => handleClick(timeFrame)}
                  className={selectedTimeFrame === timeFrame ? "selected" : ""}
                >
                  {timeFrame}
                </span>
              ))}
            </div>

            {/* Stock Info */}
            <div className="stock-info-container">
              <span className="aboutTitle">About</span>
              <span className="companyDescription">{longBusinessSummary}</span>
              <span className="showMoreLink">Show More</span>

              {/* Company Info */}
              <div className="company-info-container">
                <div className="company-info-item">
                  <span className="info-label">CEO</span>
                  <span className="info-value">{companyOfficers[0].name}</span>
                </div>
                <div className="company-info-item">
                  <span className="info-label">Employees</span>
                  <span className="info-value">{fullTimeEmployees}</span>
                </div>
                <div className="company-info-item">
                  <span className="info-label">Headquarters</span>
                  <span className="info-value">
                    {city},{state}
                  </span>
                </div>
                <div className="company-info-item">
                  <span className="info-label">Industry</span>
                  <span className="info-value">{industry}</span>
                </div>
              </div>

              {/* Company statistics */}
              <span className="key-statistics">Key statistics</span>
              <div className="statistics-container">
                <div className="statistics-column">
                  <div>
                    <span>Market cap</span>
                    <span>-</span>
                  </div>
                  <div>
                    <span>High today</span>
                    <span>{regularMarketDayHigh}</span>
                  </div>
                  <div>
                    <span>52 Week high</span>
                    <span>{fiftyTwoWeekHigh}</span>
                  </div>
                </div>

                <div className="statistics-column">
                  <div>
                    <span>Price-Earnings ratio</span>
                    <span>-</span>
                  </div>
                  <div>
                    <span>Low today</span>
                    <span>{regularMarketDayLow}</span>
                  </div>
                  <div>
                    <span>52 Week low</span>
                    <span>{fiftyTwoWeekLow}</span>
                  </div>
                </div>

                <div className="statistics-column">
                  <div>
                    <span>Dividend yield</span>
                    <span>-</span>
                  </div>
                  <div>
                    <span>Open price</span>
                    <span>—</span>
                  </div>
                </div>

                <div className="statistics-column">
                  <div>
                    <span>Average volume</span>
                    <span>-</span>
                  </div>
                  <div>
                    <span>Volume</span>
                    <span>{formatMarketCap(regularMarketVolume / 100)}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="news-title">News</span>

            {/* Company news */}
            <div className="stock-news-container">
              {companyNews &&
                companyNews.slice(0, 5).map((news) => {
                  return (
                    <a href={news.url} key={news.id}>
                      <div className="news-container">
                        <div className="news-text">
                          <span className="news-header">
                            <span>{news.source}</span>
                            <span>{timeAgo(news.datetime)}</span>
                          </span>
                          <span className="news-main-text">
                            {news.headline}
                          </span>
                          <span className="news-sub-text">{news.summary}</span>
                        </div>
                        <div className="news-image">
                          {news.image && <img src={news.image} />}
                        </div>
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>
        )}

        <div className="stock-right"></div>
      </div>
    );
  }
}

export default Stock;
