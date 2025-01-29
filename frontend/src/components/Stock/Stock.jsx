import "./Stock.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getStockData } from "../../../store/stocks";

function Stock() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();
  console.log("stockSymbol:", stockSymbol);

  const [selected, setSelected] = useState("1D");

  const stock = useSelector((state) => state.stock.currentStock);

  const { companyProfile, companyFinancials, companyNews } = stock;

  console.log(companyProfile, companyFinancials, companyNews);

  useEffect(() => {
    dispatch(getStockData(stockSymbol));
  }, [dispatch, stockSymbol]);

  const handleClick = (value) => {
    setSelected(value);
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

  function formatToMillions(value) {
    return value.toFixed(2) + "M";
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

  return (
    <div className="stock-container">
      {companyProfile && companyFinancials && companyNews && (
        <div className="stock-left">
          <span className="stock-name">{companyProfile?.ticker}</span>
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
              provision of a visual messaging application that was created to
              help people communicate through short videos and images. The
              company was founded by Frank Reginald Brown IV, Evan Thomas
              Spiegel, and Robert C
            </span>
            <span className="showMoreLink">Show More</span>

            {/* Company Info */}
            <div className="company-info-container">
              <div className="company-info-item">
                <span className="info-label">Company Name</span>
                <span className="info-value">{companyProfile.name}</span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Exchange</span>
                <span className="info-value">{companyProfile.exchange}</span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Outstanding Shares</span>
                <span className="info-value">
                  {companyProfile.shareOutstanding}
                </span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Industry</span>
                <span className="info-value">
                  {companyProfile.finnhubIndustry}
                </span>
              </div>
            </div>

            {/* Company statistics */}
            <span className="key-statistics">Key statistics</span>
            <div className="statistics-container">
              <div className="statistics-column">
                <div>
                  <span>Market cap</span>
                  <span>
                    {formatMarketCap(companyProfile.marketCapitalization)}
                  </span>
                </div>
                <div>
                  <span>High today</span>
                  <span>—</span>
                </div>
                <div>
                  <span>52 Week high</span>
                  <span>{companyFinancials.metric["52WeekHigh"]}</span>
                </div>
              </div>

              <div className="statistics-column">
                <div>
                  <span>Price-Earnings ratio</span>
                  <span>{companyFinancials.metric["peTTM"].toFixed(2)}</span>
                </div>
                <div>
                  <span>Low today</span>
                  <span>—</span>
                </div>
                <div>
                  <span>52 Week low</span>
                  <span>{companyFinancials.metric["52WeekLow"]}</span>
                </div>
              </div>

              <div className="statistics-column">
                <div>
                  <span>Dividend yield</span>
                  <span>
                    {companyFinancials.metric[
                      "dividendYieldIndicatedAnnual"
                    ].toFixed(2)}
                    %
                  </span>
                </div>
                <div>
                  <span>Open price</span>
                  <span>—</span>
                </div>
              </div>

              <div className="statistics-column">
                <div>
                  <span>Average volume</span>
                  <span>
                    {formatToMillions(
                      companyFinancials.metric["10DayAverageTradingVolume"]
                    )}
                  </span>
                </div>
                <div>
                  <span>Volume</span>
                  <span>—</span>
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
                        <span className="news-main-text">{news.headline}</span>
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

export default Stock;
