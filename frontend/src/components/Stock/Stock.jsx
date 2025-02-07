import "./Stock.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockChart from "./StockChart/";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import StockWatchList from "./StockWatchList";

import { fetchStockDetails } from "../../../store/stocks";

function Stock() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const stock = useSelector((state) => state.stocks.currentStock);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  useEffect(() => {
    dispatch(fetchStockDetails(stockSymbol));
  }, [stockSymbol, dispatch]);

  const handleClick = (value) => {
    setSelectedTimeFrame(value);
  };

  if (!stock) {
    return <LoadingSpinner />;
  }

  return (
    <div className="stock-container">
      <div className="stock-body">
        <div className="stock-main">
          <span className="stock-name">{stock?.name}</span>
          <span className="stock-price">${stock?.close}</span>
          <span className="price-change-today">
            <span
              className={`price-change ${
                stock?.regular_trading_change < 0
                  ? "negative"
                  : stock?.regular_trading_change > 0
                  ? "positive"
                  : ""
              }`}
            >
              ${stock?.regular_trading_change}
            </span>

            <span className="price-change">
              {`(${stock?.regular_trading_change_percent?.toFixed(2)}%)`}
            </span>
            <span>Today</span>
          </span>
          {stock?.market_status === "closed" ? (
            <span className="price-change-today">
              <span
                className={`price-change ${
                  stock?.late_trading_change < 0
                    ? "negative"
                    : stock?.late_trading_change > 0
                    ? "positive"
                    : ""
                }`}
              >
                {`$${stock?.late_trading_change}
              (${stock?.late_trading_change_percent?.toFixed(2)}%)`}
              </span>
              <span>Overnight</span>
            </span>
          ) : (
            <span className="price-change-overnight">24 Hour Market</span>
          )}

          {stock && (
            <StockChart selectedTimeFrame={selectedTimeFrame} stock={stock} />
          )}

          <div className="time-frame-container">
            {["1D", "1W", "1M", "3M", "1Y", "5Y"].map((timeFrame) => (
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
            <span className="companyDescription">{stock?.description}</span>
            <span className="showMoreLink">Show More</span>

            {/* Company Info */}
            <div className="company-info-container">
              <div className="company-info-item">
                <span className="info-label">CEO</span>
                <span className="info-value">-</span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Employees</span>
                <span className="info-value"> {stock?.total_employees}</span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Headquarters</span>
                <span className="info-value"> {stock?.headquarters},</span>
              </div>
              <div className="company-info-item">
                <span className="info-label">Industry</span>
                <span className="info-value"> {stock?.industry}</span>
              </div>
            </div>

            {/* Company statistics */}
            <span className="key-statistics">Key statistics</span>
            <div className="statistics-container">
              <div className="statistics-column">
                <div>
                  <span>Market cap</span>
                  <span> {stock?.market_cap}</span>
                </div>
                <div>
                  <span>High today</span>
                  <span>{stock?.high}</span>
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
                  <span>{stock?.low}</span>
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
                  <span>{stock?.open}</span>
                </div>
              </div>

              <div className="statistics-column">
                <div>
                  <span>Average volume</span>
                  <span>-</span>
                </div>
                <div>
                  <span>Volume</span>
                  <span> {stock?.volume}</span>
                </div>
              </div>
            </div>
          </div>
          <span className="news-title">News</span>

          {/* Company news */}
          <div className="stock-news-container">
            {stock?.news &&
              stock?.news?.map((news) => {
                return (
                  <a href={news?.url} key={news?.id}>
                    <div className="news-container">
                      <div className="news-text">
                        <span className="news-header">
                          <span>{news?.author}</span>
                          <span>{news?.published_utc?.split("T")[0]}</span>
                        </span>
                        <span className="news-main-text">{news?.title}</span>
                        <span className="news-sub-text">
                          {news?.description}
                        </span>
                      </div>
                      <div className="news-image">
                        {news?.image_url && <img src={news?.image_url} />}
                      </div>
                    </div>
                  </a>
                );
              })}
          </div>
        </div>

        <StockWatchList stock={stock} />
      </div>
    </div>
  );
}

export default Stock;
