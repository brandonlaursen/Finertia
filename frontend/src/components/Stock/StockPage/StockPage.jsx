import "./StockPage.css";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import StockChart from "../StockChart";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import StockWatchList from "../StockWatchList";

import { fetchStock } from "../../../../store/stocks";

function StockPage() {
  const dispatch = useDispatch();
  const { stockSymbol } = useParams();

  const stock = useSelector((state) => state.stocks.currentStock);

  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1D");

  // clicking between stocks too fast, can have old stock data
  useEffect(() => {
    dispatch(fetchStock(stockSymbol));
  }, [stockSymbol, dispatch]);

  const handleClick = (value) => {
    setSelectedTimeFrame(value);
  };

  function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    return num;
  }

  return (
    <div className="StockPage">
      {!stock.name ? (
        <LoadingSpinner />
      ) : (
        <div className="StockPage__body">
          <div className="StockPage__body__main">
            <span className="StockPage__main-name">{stock?.name}</span>
            <span className="StockPage__main-price">
              ${stock?.price?.toFixed(2)}
            </span>
            <span className="StockPage__main-StockPage__main-price-change-today">
              <span
                className={`StockPage__main-price-change ${
                  stock?.regular_trading_change < 0
                    ? "negative"
                    : stock?.regular_trading_change > 0
                    ? "positive"
                    : ""
                }`}
              >
                ${stock?.regular_trading_change}
              </span>

              <span
                className={`StockPage__main-price-change  ${
                  stock?.regular_trading_change_percent < 0
                    ? "negative"
                    : stock?.regular_trading_change_percent > 0
                    ? "positive"
                    : ""
                }`}
              >
                {`(${stock?.regular_trading_change_percent?.toFixed(2)}%)`}
              </span>
              <span>Today</span>
            </span>
            {stock?.market_status === "closed" ? (
              <span className="StockPage__main-price-change-today">
                <span
                  className={`StockPage__main-price-change  ${
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
              <span className="StockPage__main-price-change-overnight">
                24 Hour Market
              </span>
            )}

            {stock && (
              <StockChart selectedTimeFrame={selectedTimeFrame} stock={stock} />
            )}

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

            <div className="StockPage__info-container">
              <span className="aboutTitle">About</span>
              <span className="companyDescription">{stock?.description}</span>
              <span className="showMoreLink">Show More</span>

              <div className="company-info-container">
                <div className="company-info-item">
                  <span className="info-label">CEO</span>
                  <span className="info-value">-</span>
                </div>
                <div className="company-info-item">
                  <span className="info-label">Employees</span>
                  <span className="info-value">
                    {formatNumber(stock?.employees)}
                  </span>
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

              <span className="key-statistics">Key statistics</span>
              <div className="statistics-container">
                <div className="statistics-column">
                  <div>
                    <span>Market cap</span>
                    <span> {formatNumber(stock?.market_cap)}</span>
                  </div>
                  <div>
                    <span>High today</span>
                    <span>${stock?.high}</span>
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
                    <span>${stock?.low}</span>
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
                    <span>${stock?.open}</span>
                  </div>
                </div>

                <div className="statistics-column">
                  <div>
                    <span>Average volume</span>
                    <span>-</span>
                  </div>
                  <div>
                    <span>Volume</span>
                    <span> {formatNumber(stock?.volume)}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="news-title">News</span>

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
      )}
    </div>
  );
}

export default StockPage;
