import "./Stock.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockChart from "./StockChart/";
// import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import StockWatchList from "./StockWatchList";

import { fetchStockDetails } from "../../../store/stocks";

function Stock() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  const stock = useSelector((state) => state.stocks.currentStock);


  useEffect(() => {
    dispatch(fetchStockDetails(stockSymbol));
  }, [dispatch, stockSymbol]);

  const handleClick = (value) => {
    setSelectedTimeFrame(value);
  };


  return (
    <div className="stock-container">
      <div className="stock-body">
        <div className="stock-main">
          <span className="stock-name">AAPL</span>
          <span className="stock-price">190</span>
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
          // allTimeFramesData={allTimeFramesData}
          // selectedTimeFrame={selectedTimeFrame}
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
            <span className="companyDescription">
              {/* {longBusinessSummary} */}
            </span>
            <span className="showMoreLink">Show More</span>

            {/* Company Info */}
            <div className="company-info-container">
              <div className="company-info-item">
                <span className="info-label">CEO</span>
                <span className="info-value">
                  {/* {companyOfficers[0].name} */}
                </span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Employees</span>
                <span className="info-value"></span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Headquarters</span>
                <span className="info-value"></span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Industry</span>
                <span className="info-value"></span>
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
                  <span></span>
                </div>
                <div>
                  <span>52 Week high</span>
                  <span></span>
                </div>
              </div>

              <div className="statistics-column">
                <div>
                  <span>Price-Earnings ratio</span>
                  <span>-</span>
                </div>
                <div>
                  <span>Low today</span>
                  <span></span>
                </div>
                <div>
                  <span>52 Week low</span>
                  <span></span>
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
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <span className="news-title">News</span>

          {/* Company news */}
          <div className="stock-news-container">
            {/* {companyNews &&
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
                            <span className="news-sub-text">
                              {news.summary}
                            </span>
                          </div>
                          <div className="news-image">
                            {news.image && <img src={news.image} />}
                          </div>
                        </div>
                      </a>
                    );
                  })} */}
          </div>
        </div>

        <StockWatchList stock={stock} />
      </div>
    </div>
  );
}

export default Stock;
